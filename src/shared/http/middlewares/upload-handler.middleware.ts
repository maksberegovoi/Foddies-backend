import multer from 'multer'

import type { Request } from 'express'
import { ApiError } from '../errors/api.error'

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

const storage = multer.memoryStorage()

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
