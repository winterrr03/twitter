import express, { NextFunction, Request, Response } from 'express'
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
const port = 3000

databaseService.connect()

app.use(express.json())
app.use('/users', usersRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
