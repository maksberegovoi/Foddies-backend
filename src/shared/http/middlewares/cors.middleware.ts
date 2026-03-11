import cors from 'cors'
import { env } from '../../../env'

export const corsMiddleware = cors({
    origin: env.CORS_ALLOWED_ORIGINS,
    credentials: true
    // TODO: uncomment and update list of allowed methods and headers before presentation
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
})
