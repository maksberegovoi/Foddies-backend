import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { z } from 'zod'
import { ApiResponsePaginatedSchema } from '../../shared/http/types/api-response-paginated.type'
import { recipeCardSchema } from './dto/recipe-card.dto'
import { userRecipeDtoSchema } from './dto/user-recipe.dto'

registry.registerPath({
    method: 'get',
    path: '/recipes',
    summary: 'Get all recipes (Cards)',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(recipeCardSchema)
                }
            }
        }
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/my',
    summary: 'Get user recipes (Cards)',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(userRecipeDtoSchema)
                }
            }
        }
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/popular',
    summary: 'Get popular recipes (Cards)',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(recipeCardSchema))
                }
            }
        }
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/popular',
    summary: 'Get popular recipes (Cards)',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(recipeCardSchema))
                }
            }
        }
    }
})

registry.registerPath({
    method: 'get',
    path: '/recipes/favorite',
    summary: 'Get user favorite recipes (Cards)',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(recipeCardSchema))
                }
            }
        }
    }
})
