import jwt from 'jsonwebtoken'
import ApiError from '../errors/api.error'
import { env } from '../../../env'
import type { NextFunction, Request, Response } from 'express'
import UserService from '../../../modules/user/user.service'
import { AUTH_COOKIE_NAME } from '../../../modules/auth/auth-cookie'

const userService = new UserService()

const authenticateMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    const bearerToken = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null
    const cookieToken = req.cookies?.[AUTH_COOKIE_NAME]
    const token = bearerToken ?? cookieToken

    if (!token) throw ApiError.unauthorized('Missing auth token')

    let decoded: { id: string }

    try {
        decoded = jwt.verify(token, env.JWT_SECRET) as { id: string }
    } catch {
        throw ApiError.unauthorized('Invalid or expired token')
    }

    req.user = await userService.current({ userId: decoded.id })

    next()
}

export default authenticateMiddleware
