import type { Prisma } from '@prisma/client'
import type { RecipesQuerySchema } from '../schemas/param-filters.schema'

export const recipeFiltertingUtil = (params: RecipesQuerySchema) => {
    const where: Prisma.RecipeWhereInput = {}

    if (params.authorId) {
        where.ownerId = params.authorId
    }

    if (params.categoryIds?.length) {
        where.categoryId = { in: params.categoryIds }
    }

    if (params.areaIds?.length) {
        where.areaId = { in: params.areaIds }
    }

    // TODO: OR / AND ?
    if (params.ingredientIds?.length) {
        where.ingredients = {
            some: {
                ingredientId: { in: params.ingredientIds }
            }
        }
    }

    return where
}
