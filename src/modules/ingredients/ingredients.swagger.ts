import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { ingredientDtoSchema } from './dto/ingredient.dto'
import { z } from 'zod'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'

registry.registerPath({
    method: 'get',
    path: '/ingredients',
    tags: ['Ingredients'],
    summary: 'Get all ingredients',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(ingredientDtoSchema))
                }
            }
        },
        ...withErrors([500])
    }
})
