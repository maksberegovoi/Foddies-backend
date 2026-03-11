import cors from 'cors'
import { z } from 'zod'
import { env } from '../../../env'

const originsSchema = z
    .string()
    .min(1, 'CORS_ALLOWED_ORIGINS is not defined')
    .transform((val) => {
        const trimmed = val.trim()
        if (trimmed === '*') return '*'
        if (trimmed.includes(',')) {
            return trimmed
                .split(',')
                .map((url) => url.trim())
                .filter(Boolean)
        }
        return trimmed
    })
    .default('*')
    .pipe(
        z.union([
            z.literal('*'),
            z.url('Invalid URL in CORS_ALLOWED_ORIGINS'),
            z.array(z.url('Invalid URL in CORS_ALLOWED_ORIGINS'))
        ])
    )

export const corsMiddleware = cors({
    origin: originsSchema.parse(env.CORS_ALLOWED_ORIGINS),
    credentials: true
    // TODO: uncomment and update list of allowed methods and headers before presentation
    // methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization']
})
