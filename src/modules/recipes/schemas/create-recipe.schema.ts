import { z } from 'zod'

export const createRecipeSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    instructions: z.string().min(2),
    time: z.coerce.number().int().positive(),
    imageURL: z.url('Invalid image URL'),
    categoryId: z.string('Invalid category ID'),
    areaId: z.string('Invalid area ID'),
    ingredients: z.array(
        z.object({
            measure: z.string().min(1),
            ingredientId: z.string('Invalid ingredient ID')
        })
    )
})

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>
