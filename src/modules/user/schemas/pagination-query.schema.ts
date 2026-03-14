import z from 'zod'

export const paginationQuery = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().optional().default(10)
})

export type PaginationQuery = z.infer<typeof paginationQuery>
