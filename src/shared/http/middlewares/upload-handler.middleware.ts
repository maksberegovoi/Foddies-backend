import multer from 'multer'
import path from 'node:path'

import type { Request } from 'express'
import { ApiError } from '../errors/api.error'

const destination = path.resolve('temp')
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const storage = multer.diskStorage({
    destination,
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`
        const filename = `${uniquePrefix}_${file.originalname}`
        cb(null, filename)
    }
})

const limits = {
    fileSize: 1024 * 1024 * 10
}

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw ApiError.badRequest('Invalid file type. Only images are allowed.')
    }
    cb(null, true)
}

export const uploadHandler = multer({
    storage,
    limits,
    fileFilter
})
