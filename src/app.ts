import 'dotenv/config'
import express from 'express'
import router from './router.js'
import { env } from './env'
import errorHandlerMiddleware from './shared/http/middlewares/error-handler.middleware'
import { corsMiddleware } from './shared/http/middlewares/cors.middleware.js'

const app = express()

app.use(corsMiddleware)
app.use(express.json())
app.use('/api/v1', router)

// the last one
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        app.listen(env.PORT, () => {
            console.log(`SERVER WAS STARTED ON PORT ${env.PORT}`)
        })
    } catch (e) {
        console.log(e, 'Server failed to start')
    }
}

start()
