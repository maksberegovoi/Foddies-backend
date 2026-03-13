import { z } from 'zod'

export const getRecipesQuerySchema = z.object({
    limit: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().optional(),
    categoryIds: z
        .preprocess(
            (val) =>
                typeof val === 'string'
                    ? val.split(',').map(Number)
                    : undefined,
            z.array(z.cuid(`Invalid Category id`))
        )
        .optional(),
    areaIds: z
        .preprocess(
            (val) =>
                typeof val === 'string'
                    ? val.split(',').map(Number)
                    : undefined,
            z.array(z.cuid(`Invalid Area id`))
        )
        .optional(),
    ingredientIds: z
        .preprocess(
            (val) =>
                typeof val === 'string'
                    ? val.split(',').map(Number)
                    : undefined,
            z.array(z.cuid(`Invalid Ingredient id`))
        )
        .optional(),
    search: z.string().min(2).optional()
})

export type RecipesQuerySchema = z.infer<typeof getRecipesQuerySchema>
