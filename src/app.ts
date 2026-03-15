import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import router from './router.js'
import errorHandlerMiddleware from './shared/http/middlewares/error-handler.middleware'
import { corsMiddleware } from './shared/http/middlewares/cors.middleware.js'

const app = express()

app.use(corsMiddleware)
app.use(express.json())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/v1', router)

// the last one
app.use(errorHandlerMiddleware)

export default app
