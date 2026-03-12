import jwt from 'jsonwebtoken'
import ApiError from '../errors/api.error'
import { env } from '../../../env'
import type { NextFunction, Request, Response } from 'express'
import prisma from '../../../prisma'

const NOT_AUTHORIZED_ERROR = ApiError.unauthorized('Not authorized')

const authenticateMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!req.headers.authorization?.startsWith('Bearer ') || !token) {
        throw NOT_AUTHORIZED_ERROR
    }
    let userId: string
    try {
        userId = (jwt.verify(token, env.JWT_SECRET) as { id: string }).id
        if (typeof userId !== 'string') throw NOT_AUTHORIZED_ERROR
    } catch {
        throw NOT_AUTHORIZED_ERROR
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })
    if (!user || user.token !== token) throw NOT_AUTHORIZED_ERROR
    ;(req as { user?: typeof user }).user = user
    next()
}

export default authenticateMiddleware
