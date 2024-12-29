import { Request, Response } from 'express'
import { NextFunction, ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '~/models/requests/User.requests'
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

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterReqBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  throw new Error('Not implemented')
  const { name, email, password, date_of_birth } = req.body
  const result = await userService.register({ name, email, password, date_of_birth })
  res.json({
    message: 'Register success',
    result
  })
}
