import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const areaDtoSchema = registry.register(
    'AreaDto',
    z.object({
        id: z.string().openapi({ example: 'string' }),
        name: z.string().openapi({ example: 'Ukrainian' })
    })
)

export type AreaDto = z.infer<typeof areaDtoSchema>
