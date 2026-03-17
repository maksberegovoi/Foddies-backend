import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const TestimonialDtoSchema = registry.register(
    'TestimonialDto',
    z.object({
        id: z.string().openapi({ example: 'string' }),
        owner: z.string().openapi({ example: 'Artem' }),
        text: z.string().openapi({ example: 'lorem ipsum dolor sit amet' })
    })
)

export type TestimonialDto = z.infer<typeof TestimonialDtoSchema>
