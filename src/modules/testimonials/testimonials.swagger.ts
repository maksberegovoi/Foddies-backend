import { z } from 'zod'
import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { TestimonialDtoSchema } from './dto/testimonials.dto'
import { limitSchema } from '../../shared/http/schemas/pagination.schema'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'

registry.registerPath({
    method: 'get',
    path: '/testimonials',
    tags: ['Testimonials'],
    summary: 'Get all testimonials',
    request: {
        query: limitSchema
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(TestimonialDtoSchema))
                }
            }
        },
        ...withErrors([500])
    }
})
