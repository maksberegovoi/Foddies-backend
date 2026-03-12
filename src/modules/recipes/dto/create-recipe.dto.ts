import { z } from 'zod'

export const createRecipeSchema = z.object({
    title: z
        .string()
        .min(3, 'Title must be at least 3 characters long')
        .max(100, 'Title is too long'),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters long'),
    instructions: z
        .string()
        .min(10, 'Instructions must be at least 10 characters long'),
    time: z.coerce.number().positive('Time must be a positive number'),
    imageURL: z.url('Invalid image URL format'),
    categoryId: z.cuid('Invalid Category ID format'),
    areaId: z.cuid('Invalid Area ID format'),
    ingredients: z
        .array(
            z.object({
                ingredientId: z.cuid('Invalid Ingredient ID format'),
                measure: z.string().min(1, 'Measure is required (e.g., "200g")')
            })
        )
        .min(1, 'At least one ingredient is required')
})

export type createRecipeDto = z.infer<typeof createRecipeSchema>
