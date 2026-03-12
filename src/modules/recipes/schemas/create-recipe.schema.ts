import { z } from 'zod'

export const CreateRecipeSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    instructions: z.string().min(2),
    time: z.coerce.number().int().positive(),
    imageURL: z.url('Invalid image URL'),
    categoryId: z.cuid('Invalid category ID'),
    areaId: z.cuid('Invalid area ID'),
    ingredients: z.array(
        z.object({
            measure: z.string().min(1),
            ingredientId: z.cuid('Invalid ingredient ID')
        })
    )
})

export type createRecipeDto = z.infer<typeof CreateRecipeSchema>
