import { z } from 'zod'

const stringToArray = z.preprocess(
    (val) => (typeof val === 'string' ? val.split(',').filter(Boolean) : val),
    z.array(z.string())
)

export const getRecipesQuerySchema = z.object({
    authorId: z.string().optional(),
    limit: z.coerce.number().int().positive(),
    page: z.coerce.number().int().positive(),
    categoryIds: stringToArray.optional(),
    areaIds: stringToArray.optional(),
    ingredientIds: stringToArray.optional()
})

export type RecipesQuerySchema = z.infer<typeof getRecipesQuerySchema>
