import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import databaseServices from '~/services/database.services'
import userService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  res.json({
    email: email,
    password: password
  })
}

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password, date_of_birth } = req.body
  try {
    const result = await userService.register({ name, email, password, date_of_birth })
    return res.json({
      message: 'Register success',
      result
    })
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      message: 'Register failed',
      error
    })
  }
}