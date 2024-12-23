import { Router } from 'express'
import { loginValidation } from '../middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidation, (req, res) => {
  const { email, password } = req.body
  res.json({
    email: email,
    password: password
  })
})

export default usersRouter
