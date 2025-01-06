import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
config()

export const signToken = ({
  payload,
  privateKey = process.env.JWT_SECRET_KEY as string,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object
  privateKey?: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) reject(error)
      resolve(token as string)
    })
  })
}

export const verifyAccessToken = ({
  token,
  secretKey = process.env.JWT_SECRET_KEY as string
}: {
  token: string
  secretKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) reject(error)
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
