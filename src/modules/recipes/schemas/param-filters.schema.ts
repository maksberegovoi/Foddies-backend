import { registry, z } from '../../../shared/api-docs/swagger'
const stringToArray = z.preprocess(
    (val) => (typeof val === 'string' ? val.split(',').filter(Boolean) : val),
    z.array(z.string())
)

export const getRecipesQuerySchema = registry.register(
    'RecipesQueryDto',
    z.object({
        authorId: z.string().optional(),
        limit: z.coerce.number().int().positive().optional().default(10),
        page: z.coerce.number().int().positive().optional().default(1),
        categoryId: z.string().optional(),
        areaId: z.string().optional(),
        ingredientIds: stringToArray.optional()
    })
)

export type RecipesQuerySchema = z.infer<typeof getRecipesQuerySchema>
