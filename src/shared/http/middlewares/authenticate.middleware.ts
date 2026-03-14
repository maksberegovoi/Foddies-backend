import jwt from 'jsonwebtoken'
import ApiError from '../errors/api.error'
import { env } from '../../../env'
import type { NextFunction, Request, Response } from 'express'
import UserService from '../../../modules/user/user.service'

const userService = new UserService()

const authenticateMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer ')) {
        throw ApiError.unauthorized('Missing or invalid token format')
    }
    const token = authHeader.split(' ')[1]

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
