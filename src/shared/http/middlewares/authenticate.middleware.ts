import jwt from 'jsonwebtoken'
import ApiError from '../errors/api.error'
import { env } from '../../../env'
import type { NextFunction, Request, Response } from 'express'
import prisma from '../../../prisma'

const authenticateMiddleware = async (
    req: Request,
    _: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!req.headers.authorization?.startsWith('Bearer ') || !token) {
        throw ApiError.unauthorized()
    }
    try {
        const { id } = jwt.verify(token, env.JWT_SECRET) as { id: unknown }
        if (typeof id !== 'string') throw ApiError.unauthorized()
        // TODO - Replace this method with user module method when it will be implemented
        const user = await prisma.user.findUnique({
            where: { id }
        })
        if (!user || user.token !== token) throw ApiError.unauthorized()
        req.user = user
        next()
    } catch {
        next(ApiError.unauthorized())
    }
}

export default authenticateMiddleware
