import type { CookieOptions } from 'express'
import { env, isProd } from '../../env'

export const AUTH_COOKIE_NAME = env.AUTH_COOKIE_NAME

const jwtExpiresInToMs: Record<typeof env.JWT_EXPIRES_IN, number> = {
    '15m': 15 * 60 * 1000,
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
}

export const getAuthCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: jwtExpiresInToMs[env.JWT_EXPIRES_IN],
    path: '/',
    ...(env.AUTH_COOKIE_DOMAIN ? { domain: env.AUTH_COOKIE_DOMAIN } : {})
})
