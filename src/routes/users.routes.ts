import { Router } from 'express'
import { loginValidation, logoutValidation, registerValidation } from '../middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
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
usersRouter.post(
  '/logout',
  logoutValidation,
  wrapRequestHandler((req, res) => {
    res.json({ message: 'Logout success' })
  })
)
export default usersRouter
