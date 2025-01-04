import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'

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
    return {
      accessToken,
      refreshToken
    }
  }

  async checkEmailExist(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return user
  }

  async login(user_id: string) {
    const [accessToken, refreshToken] = await this.signAccessAnhRefreshTokens(user_id)
    return {
      accessToken,
      refreshToken
    }
  }
}

const userService = new UserService()
export default userService
