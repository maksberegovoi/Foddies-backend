import { z } from 'zod'
import { registry } from '../../api-docs/swagger'

export const PaginationTypeSchema = registry.register(
    'PaginationDto',
    z.object({
        total: z.number(),
        page: z.number(),
        limit: z.number()
    })
)

export type PaginationType = z.infer<typeof PaginationTypeSchema>
