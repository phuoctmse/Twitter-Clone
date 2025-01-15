import { Router } from 'express'
import {
  loginValidation,
  accessTokenValidation,
  registerValidation,
  refreshTokenValidation,
  emailVerifyTokenValidation,
  forgotPasswordTokenValidation,
  verifyForgotPasswordTokenValidation
} from '../middlewares/users.middlewares'
import {
  emailVerifyController,
  forgotPasswordController,
  loginController,
  logoutController,
  refreshTokenController,
  registerController,
  resendEmailVerifyController,
  verifyForgotPasswordController
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
 * Path: /resend-verify-email
 * Method: POST
 * Description: Resend verify a user's email
 * Headers: { Authorization: Bearer <access_token> }
 */
usersRouter.post('/resend-verify-email', accessTokenValidation, wrapRequestHandler(resendEmailVerifyController))

/**
 * Path: /forgot-password
 * Method: POST
 * Description: Forgot password
 * Body: { email: string }
 */
usersRouter.post('/forgot-password', forgotPasswordTokenValidation, wrapRequestHandler(forgotPasswordController))

/**
 * Path: /verify-forgot-password
 * Method: POST
 * Description: Verify link forgot password
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidation,
  wrapRequestHandler(verifyForgotPasswordController)
)

/**
 * Path: /reset-password
 * Method: POST
 * Description: Reset password
 * Body: { forgot_password_token: string }
 */
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidation,
  wrapRequestHandler(verifyForgotPasswordController)
)

export default usersRouter
