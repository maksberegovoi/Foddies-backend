import cors from 'cors'
import { z } from 'zod'
import { env } from '../../../env'

const parseOrigins = (originsRaw: string) => {
    if (originsRaw.trim() === '*') return '*'
    return originsRaw
        .split(',')
        .map((url) => z.url('Invalid CORS origin URL').parse(url.trim()))
}

export const corsMiddleware = cors({
    origin: parseOrigins(env.CORS_ALLOWED_ORIGINS),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})
