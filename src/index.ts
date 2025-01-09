import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'

const app = express()
const port = 3000

// Connect to database
databaseServices.connect()

// Middleware
app.use(express.json())

// Routes
app.use('/users', usersRouter)

//Error handling
app.use(defaultErrorHandler as any)
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

export default app
