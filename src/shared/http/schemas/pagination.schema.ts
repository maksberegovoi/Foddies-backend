import z from 'zod'
import { registry } from '../../api-docs/swagger'

export const limitSchema = registry.register(
    'LimitQueryDto',
    z.object({
        limit: z.coerce
            .number()
            .int()
            .positive('Limit must be a positive integer')
            .default(4)
    })
)
