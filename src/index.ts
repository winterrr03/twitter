import express, { NextFunction, Request, Response } from 'express'
import { config } from 'dotenv'
config()
import databaseService from './services/database.services'
import usersRouter from './routes/users.routes'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/files'
import staticRouter from './routes/static.routes'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 4000

databaseService.connect().then(() => {
  databaseService.indexUsers()
})

initFolder()

app.use(cors())
app.use(express.json())
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)

app.use('/static', staticRouter)

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`App is running on port ${port}`)
})
