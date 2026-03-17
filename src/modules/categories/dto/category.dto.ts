import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const categoryDtoSchema = registry.register(
    'CategoryDto',
    z.object({ id: z.string(), name: z.string(), description: z.string() })
)

export type CategoryDto = z.infer<typeof categoryDtoSchema>
