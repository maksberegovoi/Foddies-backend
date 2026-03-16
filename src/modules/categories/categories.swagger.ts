import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { z } from 'zod'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'
import { categoryDtoSchema } from './dto/category.dto'

registry.registerPath({
    method: 'get',
    path: '/categories',
    tags: ['Categories'],
    summary: 'Get all categories',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(categoryDtoSchema))
                }
            }
        },
        ...withErrors([500])
    }
})
