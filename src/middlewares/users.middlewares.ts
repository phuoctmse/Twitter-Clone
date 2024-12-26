import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/utils/validation'

export const loginValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' })
  }
  next()
}

export const registerValidation = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      isLength: {
        errorMessage: 'Name must be at least 1 characters long',
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        errorMessage: 'Password must be at least 8 characters long',
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        errorMessage:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
        options: {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1
        }
      }
    },
    confirm_password: {
      notEmpty: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password')
          }
          return value
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: {
          strict: true,
          strictSeparator: true
        }
      }
    }
  })
)
