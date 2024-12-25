import { Router } from 'express'
import { loginValidation } from '../middlewares/users.middlewares'
import { loginController, registerController } from '~/controllers/users.controllers'
const usersRouter = Router()

usersRouter.post('/login', loginValidation, loginController)
usersRouter.post('/register', registerController)

export default usersRouter
