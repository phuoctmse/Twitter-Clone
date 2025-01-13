import { Router } from 'express'
import {
  loginValidation,
  accessTokenValidation,
  registerValidation,
  refreshTokenValidation,
  emailVerifyTokenValidation
} from '../middlewares/users.middlewares'
import {
  emailVerifyController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController
} from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()

/**
 * Path: /Login
 * Method: POST
 * Description: Login a user
 * Body: { email: string, password: string }
 */

usersRouter.post('/login', loginValidation, wrapRequestHandler(loginController))
/**
 * Path: /register
 * Method: POST
 * Description: Register a new user
 * Body: { name: string, email: string, password: string, confirm_password: string,
 * date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

/**
 * Path: /Logout
 * Method: POST
 * Description: Logout a user
 * Headers: { Authorization: Bearer <access_token> }
 * Body: { refresh_token: string }
 */
usersRouter.post('/logout', accessTokenValidation, refreshTokenValidation, wrapRequestHandler(logoutController))

/**
 * Path: /refresh-token
 * Method: POST
 * Description: Refresh a user's access token
 * Body: { refresh_token: string }
 */
usersRouter.post('/refresh-token', refreshTokenValidation, wrapRequestHandler(refreshTokenController))

/**
 * Path: /verify-email
 * Method: POST
 * Description: Verify a user's email
 * Body: { refresh_token: string }
 */
usersRouter.post('/verify-email', emailVerifyTokenValidation, wrapRequestHandler(emailVerifyController))

/**
 * Path: /verify-email
 * Method: POST
 * Description: Verify a user's email
 * Body: { refresh_token: string }
 */
usersRouter.post('/resend-verify-email', accessTokenValidation, wrapRequestHandler(resendEmailVerifyController))
export default usersRouter
