import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

export const ingredientDtoSchema = registry.register(
    'IngredientDto',
    z.object({
        id: z.string().openapi({ example: 'string' }),
        name: z.string().openapi({ example: 'Egg' }),
        description: z
            .string()
            .openapi({ example: 'lorem ipsum dolor sit amet' }),
        imageURL: z
            .string()
            .openapi({ example: 'https://example.com/image.jpg' })
    })
)

export type IngredientDto = z.infer<typeof ingredientDtoSchema>
