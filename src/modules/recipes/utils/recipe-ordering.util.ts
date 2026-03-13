import { Prisma } from '@prisma/client'
import { RecipesQuerySchema } from '../schemas/param-filters.schema'

export const recipeOrderingUtil = (params: RecipesQuerySchema) => {
    const where: Prisma.RecipeWhereInput = {
        AND: [
            {
                ...(params.categoryIds && {
                    categoryId: { in: params.categoryIds }
                }),

                ...(params.areaIds && {
                    areaId: { in: params.areaIds }
                }),

                ...(params.ingredientIds && {
                    ingredients: {
                        some: {
                            ingredientId: { in: params.ingredientIds }
                        }
                    }
                })
            },
            ...(params.search
                ? [
                      {
                          OR: [
                              {
                                  title: {
                                      contains: params.search,
                                      mode: Prisma.QueryMode.insensitive
                                  }
                              },
                              {
                                  description: {
                                      contains: params.search,
                                      mode: Prisma.QueryMode.insensitive
                                  }
                              },
                              {
                                  area: {
                                      name: {
                                          contains: params.search,
                                          mode: Prisma.QueryMode.insensitive
                                      }
                                  }
                              }
                          ]
                      }
                  ]
                : [])
        ]
    }

    return where
}
