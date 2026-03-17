import 'dotenv/config'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import router from './router.js'
import errorHandlerMiddleware from './shared/http/middlewares/error-handler.middleware'
import { corsMiddleware } from './shared/http/middlewares/cors.middleware.js'
import swaggerUi from 'swagger-ui-express'
import './shared/api-docs/all-routes'
import { getOpenApiDocumentation } from './shared/api-docs/swagger'

const app = express()

app.use(corsMiddleware)
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(express.json())
app.use('/api/v1', router)

app.use('/api-docs', swaggerUi.serve)
app.use('/api-docs', (req, res, next) => {
    const swaggerDocument = getOpenApiDocumentation()
    swaggerUi.setup(swaggerDocument)(req, res, next)
})
app.get('/api-docs-json', (req, res) => {
    const swaggerDocument = getOpenApiDocumentation()
    res.json(swaggerDocument)
})

// the last one
app.use(errorHandlerMiddleware)

export default app
