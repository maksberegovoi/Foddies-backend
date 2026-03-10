import { z } from 'zod'

// Value can be * literal, a single URL, or a comma-separated list of URLs
const corsOriginsSchema = z
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
    .pipe(
        z.union([
            z.literal('*'),
            z.url('Invalid URL in CORS_ALLOWED_ORIGINS'),
            z.array(z.url('Invalid URL in CORS_ALLOWED_ORIGINS')).min(1)
        ])
    )

const envSchema = z.object({
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(['dev', 'production']),
    PORT: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.enum(['15m', '30m', '1h', '7d', '30d']),
    CORS_ALLOWED_ORIGINS: corsOriginsSchema.default('*')
})

export const env = envSchema.parse(process.env)
export const isDev = env.NODE_ENV === 'dev'
export const isProd = env.NODE_ENV === 'production'
