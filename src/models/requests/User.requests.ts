import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'

export interface LoginReqBody {
  email: string
  password: string
}
export interface RegisterReqBody {
  name: string
  email: string
  password: string
  date_of_birth: Date
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface forgotPasswordReqBody {
  email: string
}

export interface EmailVerifyReqBody {
  email_verify_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
