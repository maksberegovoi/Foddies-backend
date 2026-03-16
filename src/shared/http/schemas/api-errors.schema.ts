import { z } from 'zod'
import { registry } from '../../api-docs/swagger'

// 401, 404, 500
export const ApiErrorSchema = registry.register(
    'ApiErrorSchema',
    z.object({
        path: z.string().openapi({ example: '/api/v1/resource-example' }),
        method: z.string().openapi({ example: 'GET' }),
        timestamp: z.iso.datetime(),
        message: z.string()
    })
)

// 400 - Zod
export const ApiValidationErrorSchema = registry.register(
    'ApiValidationErrorSchema',
    ApiErrorSchema.extend({
        message: z.literal('Validation failed'),
        errors: z.array(
            z.object({
                path: z.string().openapi({ example: 'email' }),
                message: z.string().openapi({
                    example:
                        'Invalid input: expected string, received undefined'
                })
            })
        )
    })
)
