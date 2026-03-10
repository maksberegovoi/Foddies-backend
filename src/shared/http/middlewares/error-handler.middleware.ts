import { type ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'
import ApiError from '../errors/api.error'

const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, _next) => {
    const errorResponse = {
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString()
    }

    if (err instanceof ApiError) {
        return res.status(err.status).json({
            ...errorResponse,
            message: err.message
        })
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            ...errorResponse,
            message: 'Validation failed',
            errors: err.issues.map((issue) => ({
                path: issue.path.join('.'),
                message: issue.message
            }))
        })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        let status = 500
        let message = 'Database error'

        switch (err.code) {
            case 'P2000':
                status = 400
                message = 'Invalid data'
                break
            case 'P2002':
                status = 409
                message = 'Record already exists'
                break
            case 'P2003':
                status = 409
                message = 'Restricted operation'
                break
            case 'P2025':
                status = 404
                message = 'Record not found'
                break
        }

        return res.status(status).json({
            ...errorResponse,
            message
        })
    }

    if (
        err instanceof SyntaxError &&
        'status' in err &&
        err.status === 400 &&
        'body' in err
    ) {
        return res.status(400).json({
            ...errorResponse,
            message: 'Incorrect JSON format'
        })
    }

    return res.status(500).json({
        ...errorResponse,
        message: 'Unexpected error'
    })
}

export default errorHandlerMiddleware
