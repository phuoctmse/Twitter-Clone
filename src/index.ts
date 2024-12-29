import express, { Request, Response, NextFunction } from 'express'
import usersRouter from './routes/users.routes'
import databaseServices from './services/database.services'

const app = express()
const port = 3000

// Middleware
app.use(express.json())

// Routes
app.use('/users', usersRouter)

//Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error: ', err.message)
  res.status(500).json({ error: err.message })
})
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// Connect to database
databaseServices.connect()

export default app
