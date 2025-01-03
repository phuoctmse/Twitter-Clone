import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import USER_MESSAGES from '~/constants/messages'
// import { ErrorWithStatus } from '~/models/Errors'
// import databaseServices from '~/services/database.services'
import userService from '~/services/users.services'
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
      notEmpty: {
        errorMessage: USER_MESSAGES.NAME_IS_REQUIRED
      },
      isString: {
        errorMessage: USER_MESSAGES.NAME_MUST_BE_A_STRING
      },
      isLength: {
        errorMessage: USER_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100,
        options: {
          min: 1,
          max: 100
        }
      },
      trim: true
    },
    email: {
      notEmpty: {
        errorMessage: USER_MESSAGES.EMAIL_IS_REQUIRED
      },
      isEmail: {
        errorMessage: USER_MESSAGES.EMAIL_IS_INVALID
      },
      trim: true,
      custom: {
        options: async (value) => {
          const isExistEmail = await userService.checkEmailExist(value)
          if (isExistEmail) {
            throw new Error(USER_MESSAGES.EMAIL_ALREADY_EXISTS)
          }
          return isExistEmail
        }
      }
    },
    password: {
      notEmpty: {
        errorMessage: USER_MESSAGES.PASSWORD_IS_REQUIRED
      },
      isString: {
        errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_A_STRING
      },
      isLength: {
        errorMessage: USER_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50,
        options: {
          min: 6,
          max: 50
        }
      },
      isStrongPassword: {
        errorMessage: USER_MESSAGES.PASSWORD_MUST_BE_STRONG,
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
      notEmpty: {
        errorMessage: USER_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
      },
      custom: {
        options: (value: any, { req }: { req: Request }) => {
          if (value !== req.body.password) {
            throw new Error(USER_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
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
        },
        errorMessage: USER_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    }
  })
)
