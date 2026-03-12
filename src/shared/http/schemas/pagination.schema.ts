import z from 'zod'

export const pageSchema = z.object({
    page: z.coerce.number().int().positive('Page must be a positive integer')
})

export const limitSchema = z.object({
    limit: z.coerce.number().int().positive('Limit must be a positive integer')
})
