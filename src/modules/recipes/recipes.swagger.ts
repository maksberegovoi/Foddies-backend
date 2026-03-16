import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { z } from 'zod'
import { ApiResponsePaginatedSchema } from '../../shared/http/types/api-response-paginated.type'
import { recipeCardSchema } from './dto/recipe-card.dto'
import { userRecipeDtoSchema } from './dto/user-recipe.dto'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'
import { recipeDtoSchema } from './dto/recipe.dto'
import { createRecipeSchema } from './schemas/create-recipe.schema'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'
import { getRecipesQuerySchema } from './schemas/param-filters.schema'
import { paginationQuery } from '../user/schemas/pagination-query.schema'
import { limitSchema } from '../../shared/http/schemas/pagination.schema'

registry.registerPath({
    method: 'get',
    path: '/recipes',
    tags: ['Recipes'],
    summary: 'Get all recipes (Cards)',
    request: {
        query: getRecipesQuerySchema
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(recipeCardSchema)
                }
            }
        },
        ...withErrors([500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/my',
    tags: ['Recipes'],
    summary: 'Get user recipes (Cards)',
    security: [{ bearerAuth: [] }],
    request: {
        query: paginationQuery
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(userRecipeDtoSchema)
                }
            }
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/popular',
    tags: ['Recipes'],
    summary: 'Get popular recipes (Cards)',
    request: {
        query: limitSchema
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(recipeCardSchema))
                }
            }
        },
        ...withErrors([500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/favorite',
    tags: ['Recipes'],
    summary: 'Get user favorite recipes (Cards)',
    security: [{ bearerAuth: [] }],
    request: {
        query: paginationQuery
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(recipeCardSchema)
                }
            }
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/{id}',
    tags: ['Recipes'],
    summary: 'Get Recipe by ID',
    request: {
        params: idParamSchema
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(recipeDtoSchema)
                }
            }
        },
        ...withErrors([404, 500])
    }
})

registry.registerPath({
    method: 'post',
    path: '/recipes/{id}/favorite',
    tags: ['Recipes'],
    summary: 'Add recipe to user favorites',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        204: {
            description: 'Successful'
        },
        ...withErrors([401, 404, 500])
    }
})

registry.registerPath({
    method: 'delete',
    path: '/recipes/{id}/favorite',
    tags: ['Recipes'],
    summary: 'Delete recipe from user favorites',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        204: {
            description: 'Successful'
        },
        ...withErrors([401, 404, 500])
    }
})

registry.registerPath({
    method: 'post',
    path: '/recipes',
    tags: ['Recipes'],
    summary: 'Create Recipe',
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: createRecipeSchema.extend({
                        image: z.string().openapi({
                            type: 'string',
                            format: 'binary'
                        })
                    })
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(idParamSchema)
                }
            }
        },
        ...withErrors([400, 401, 404, 500])
    }
})

registry.registerPath({
    method: 'delete',
    path: '/recipes/{id}',
    tags: ['Recipes'],
    summary: 'Delete recipe',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        204: {
            description: 'Successful'
        },
        ...withErrors([401, 404, 500])
    }
})
