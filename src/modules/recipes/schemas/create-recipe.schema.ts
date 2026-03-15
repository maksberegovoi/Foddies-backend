import { z } from 'zod'

const ingredientItemSchema = z.object({
    measure: z.string().min(1),
    ingredientId: z.string('Invalid ingredient ID')
})

export const createRecipeSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(2),
    instructions: z.string().min(2),
    time: z.coerce.number().int().positive(),
    categoryId: z.string('Invalid category ID'),
    areaId: z.string('Invalid area ID'),
    ingredients: z.preprocess((value) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value)
            } catch {
                return value
            }
        }
        return value
    }, z.array(ingredientItemSchema).min(1))
})

export type CreateRecipeDto = z.infer<typeof createRecipeSchema>
