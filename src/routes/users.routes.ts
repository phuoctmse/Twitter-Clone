import { Router } from 'express'
import { loginValidation, registerValidation } from '../middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const usersRouter = Router()

usersRouter.post('/login', loginValidation, loginController)
/**
 * Path: /register
 * Method: POST
 * Description: Register a new user
 * Body: { name: string, email: string, password: string, confirm_password: string,
 * date_of_birth: ISO8601 }
 */
usersRouter.post('/register', registerValidation, wrapRequestHandler(registerController))

export default usersRouter
