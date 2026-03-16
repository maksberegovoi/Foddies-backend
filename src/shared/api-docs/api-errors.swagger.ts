import {
    ApiErrorSchema,
    ApiValidationErrorSchema
} from '../http/schemas/api-errors.schema'

export const errorResponses = {
    unauthorized: {
        description: 'Unauthorized - Missing or invalid token',
        content: { 'application/json': { schema: ApiErrorSchema } }
    },
    forbidden: {
        description: 'Forbidden - You do not have permission',
        content: { 'application/json': { schema: ApiErrorSchema } }
    },
    notFound: {
        description: 'Resource not found',
        content: { 'application/json': { schema: ApiErrorSchema } }
    },
    validation: {
        description: 'Validation failed',
        content: { 'application/json': { schema: ApiValidationErrorSchema } }
    },
    internal: {
        description: 'Unexpected error',
        content: { 'application/json': { schema: ApiErrorSchema } }
    }
}

export const withErrors = (codes: (400 | 401 | 403 | 404 | 500)[]) => {
    const responses: any = {}

    codes.forEach((code) => {
        if (code === 400) responses[400] = errorResponses.validation
        if (code === 401) responses[401] = errorResponses.unauthorized
        if (code === 403) responses[403] = errorResponses.forbidden
        if (code === 404) responses[404] = errorResponses.notFound
        if (code === 500) responses[500] = errorResponses.internal
    })

    return responses
}
