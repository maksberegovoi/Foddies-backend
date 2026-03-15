import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { z } from 'zod'
import { areaDtoSchema } from './dto/areas-response.dto'

registry.registerPath({
    method: 'get',
    path: '/areas',
    summary: 'Get all areas',
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(z.array(areaDtoSchema))
                }
            }
        }
    }
})
