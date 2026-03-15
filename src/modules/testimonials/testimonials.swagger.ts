import { z } from 'zod'
import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { TestimonialDtoSchema } from './dto/testimonials.dto'

registry.registerPath({
    method: 'get',
    path: '/testimonials',
    summary: 'Get all testimonials',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(TestimonialDtoSchema))
                }
            }
        }
    }
})
