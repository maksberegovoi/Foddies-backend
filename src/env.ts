import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(['dev', 'production']),
    PORT: z.string(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.enum(['15m', '30m', '1h', '7d', '30d']),
    CORS_ALLOWED_ORIGINS: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
    AUTH_COOKIE_NAME: z.string().default('accessToken'),
    AUTH_COOKIE_DOMAIN: z.string().optional()
})

export const env = envSchema.parse(process.env)
export const isDev = env.NODE_ENV === 'dev'
export const isProd = env.NODE_ENV === 'production'
