import User from '~/models/schemas/User.schema'
import databaseServices from './database.services'

class UserService {
  async register(payload: { name: string; email: string; password: string; date_of_birth: Date }) {
    const { name, email, password, date_of_birth } = payload
    const result = await databaseServices.users.insertOne(
      new User({
        name,
        email,
        password,
        date_of_birth
      })
    )
    return result
  }
}

const userService = new UserService()
export default userService
