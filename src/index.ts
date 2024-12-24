import express from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'

const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Routes
app.use('/users', usersRouter)

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Connect to database
databaseServices.connect()

export default app
