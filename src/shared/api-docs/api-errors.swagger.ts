import {
    ApiErrorSchema,
    ApiValidationErrorSchema
} from '../http/schemas/api-errors.schema'

type ErrorCode = 400 | 401 | 403 | 404 | 500

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
const codeToErrorMap = {
    400: errorResponses.validation,
    401: errorResponses.unauthorized,
    403: errorResponses.forbidden,
    404: errorResponses.notFound,
    500: errorResponses.internal
} as const

export const withErrors = <T extends ErrorCode>(codes: T[]) => {
    const responses = {} as { [K in T]: (typeof codeToErrorMap)[K] }

    codes.forEach((code) => {
        responses[code] = codeToErrorMap[code]
    })

    return responses
}
