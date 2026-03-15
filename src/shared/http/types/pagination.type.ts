import { z } from 'zod'

export const PaginationTypeSchema = z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number()
})

export type PaginationType = z.infer<typeof PaginationTypeSchema>
