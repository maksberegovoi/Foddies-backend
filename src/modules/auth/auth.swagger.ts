import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'
import { signInSchema } from './schemas/sign-in.schema'
import { userDtoSchema } from '../user/dto/user.dto'
import { signUpSchema } from './schemas/sign-up.schema'
import { signInResponseSchema } from './schemas/sign-in-response.schema'

registry.registerPath({
    method: 'post',
    path: '/auth/signup',
    tags: ['Auth'],
    summary: 'Sign Up',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: signUpSchema
                }
            }
        }
    },
    responses: {
        201: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(userDtoSchema)
                }
            }
        },
        ...withErrors([500])
    }
})

registry.registerPath({
    method: 'post',
    path: '/auth/signin',
    tags: ['Auth'],
    summary: 'Sign In',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: signInSchema
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(signInResponseSchema)
                }
            }
        },
        ...withErrors([500])
    }
})

registry.registerPath({
    method: 'post',
    path: '/auth/signout',
    tags: ['Auth'],
    summary: 'Sign Out',
    security: [{ bearerAuth: [] }],
    responses: {
        204: {
            description: 'Successful response'
        },
        ...withErrors([401, 500])
    }
})
