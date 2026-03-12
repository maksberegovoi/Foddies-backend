import type { User } from '@prisma/client'
import ApiError from '../http/errors/api.error'
import type { Request } from 'express'

const getUser = (req: Request): User => {
    const { user } = req as { user?: User }
    if (!user) throw ApiError.unauthorized('Unauthorized')
    return user
}

export default getUser
