import type { Prisma } from '@prisma/client'
import type { RecipesQuerySchema } from '../schemas/param-filters.schema'

export const recipeFilteringUtil = (params: RecipesQuerySchema) => {
    const where: Prisma.RecipeWhereInput = {}

    if (params.authorId) {
        where.ownerId = params.authorId
    }

    if (params.categoryId) {
        where.categoryId = params.categoryId
    }

    if (params.areaId) {
        where.areaId = params.areaId
    }

    if (params.ingredientIds?.length) {
        where.AND = params.ingredientIds.map((id) => ({
            ingredients: {
                some: {
                    ingredientId: id
                }
            }
        }))
    }

    return where
}
