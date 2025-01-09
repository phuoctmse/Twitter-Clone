import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { config } from 'dotenv'
import USER_MESSAGES from '~/constants/messages'
config()

class UserService {
  private signAccessToken(userId: string) {
    return signToken({
      payload: {
        userId,
        token_type: TokenType.AccessToken
      },
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
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    })
  }

  private async signAccessAnhRefreshTokens(userId: string) {
    return await Promise.all([this.signAccessToken(userId), this.signRefreshToken(userId)])
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password)
      })
    )
    const userId = result.insertedId.toString()
    const [accessToken, refreshToken] = await this.signAccessAnhRefreshTokens(userId)
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(userId), token: refreshToken })
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
}

const userService = new UserService()
export default userService
