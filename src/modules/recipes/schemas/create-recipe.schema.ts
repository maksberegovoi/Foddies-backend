import { z } from 'zod'
import { registry } from '../../../shared/api-docs/swagger'

const ingredientItemSchema = z.object({
    measure: z.string().min(1).openapi({ example: '180g' }),
    ingredientId: z
        .string('Invalid ingredient ID')
        .openapi({ example: 'stringId' })
})

export const createRecipeSchema = registry.register(
    'CreateRecipeDto',
    z.object({
        title: z.string().min(2).openapi({ example: 'Borscht' }),
        description: z
            .string()
            .min(2)
            .openapi({ example: 'lorem ipsum dolor sit amet' }),
        instructions: z
            .string()
            .min(2)
            .openapi({ example: 'lorem ipsum dolor sit amet' }),
        time: z.coerce.number().int().positive().openapi({ example: 180 }),
        categoryId: z
            .string('Invalid category ID')
            .openapi({ example: '6462a6cd4c3d0ddd28897f95' }),
        areaId: z
            .string('Invalid area ID')
            .openapi({ example: '6462a6f04c3d0ddd28897f9b' }),
        ingredients: z
            .preprocess((value) => {
                if (typeof value === 'string') {
                    let preparedValue = value.trim()

                    if (
                        preparedValue.startsWith('{') &&
                        !preparedValue.startsWith('[')
                    ) {
                        preparedValue = `[${preparedValue}]`
                    }

                    try {
                        const parsed = JSON.parse(preparedValue)
                        return Array.isArray(parsed) ? parsed : [parsed]
                    } catch {
                        return value
                    }
                }

                if (Array.isArray(value)) {
                    return value.map((item) => {
                        if (typeof item === 'string') {
                            try {
                                return JSON.parse(item)
                            } catch {
                                return item
                            }
                        }
                        return item
                    })
                }
                return value
            }, z.array(ingredientItemSchema).min(1))
            .openapi({
                type: 'string',
                description:
                    'Введите массив ингредиентов в формате JSON. Пример: [{"ingredientId": "id123", "measure": "200g"}]',
                example:
                    '[{"ingredientId": "640c2dd963a319ea671e383b", "measure": "200g"}, {"ingredientId": "640c2dd963a319ea671e3860", "measure": "500g"}]'
            })
    })
)

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>
