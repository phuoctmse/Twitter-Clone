import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
import USER_MESSAGES from '~/constants/messages'
import { update } from 'lodash'
config()

class UserService {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    })
  }

  private signRefreshToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.RefreshToken
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private signEmailVerifyToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.EmailVerificationToken
      },
      privateKey: process.env.JWT_SECRET_VERIFIED_EMAIL_TOKEN as string,
      options: {
        expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_IN
      }
    })
  }

  private async signAccessAnhRefreshTokens(userId: string) {
    return await Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }
  async register(payload: RegisterReqBody) {
    const newUserId = new ObjectId()
    const userIdToString = newUserId.toString()
    const email_verify_token = await this.signEmailVerifyToken(userIdToString)
    await databaseServices.users.insertOne(
      new User({
        ...payload,
        _id: newUserId,
        email_verify_token,
        password: hashPassword(payload.password)
      })
    )
    const [accessToken, refreshToken] = await this.signAccessAnhRefreshTokens(userIdToString)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userIdToString), token: refreshToken })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return user
  }

  async login(userId: string) {
    const [accessToken, refreshToken] = await this.signAccessAnhRefreshTokens(userId)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
    )
    return {
      accessToken,
      refreshToken
    }
  }

  async logout(refreshToken: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refreshToken })
    return {
      message: USER_MESSAGES.LOGOUT_SUCCESS
    }
  }

  async refreshToken(userId: string, refresh_token: string) {
    const [new_access_token, new_refresh_token] = await Promise.all([
      this.signAccessToken(userId),
      this.signRefreshToken(userId),
      databaseServices.refreshTokens.deleteOne({ token: refresh_token })
    ])
    const result = await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: new_refresh_token })
    )
    return {
      accessToken: new_access_token,
      refreshToken: new_refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    await databaseServices.users.updateOne({ _id: new ObjectId(user_id) }, [
      {
        $set: {
          email_verify_token: '',
          verify: UserVerifyStatus.Verified,
          updated_at: '$$NOW'
        }
      }
    ])
    return {
      message: USER_MESSAGES.EMAIL_VERIFIED_SUCCESS
    }
  }
}

const userService = new UserService()
export default userService
