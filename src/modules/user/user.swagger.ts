import { registry } from '../../shared/api-docs/swagger'
import { ApiResponseSchema } from '../../shared/http/types/api-response.type'
import { withErrors } from '../../shared/api-docs/api-errors.swagger'
import {
    userProfileDtoSchema,
    userProfilePublicDtoSchema
} from './dto/user.dto'
import { ApiResponsePaginatedSchema } from '../../shared/http/types/api-response-paginated.type'
import { paginationQuery } from './schemas/pagination-query.schema'
import { z } from 'zod'
import { updateAvatarResponseDtoSchema } from './dto/update-avatar-response.dto'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'

registry.registerPath({
    method: 'get',
    path: '/users/current',
    tags: ['User'],
    summary: 'Current user',
    security: [{ bearerAuth: [] }],
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(userProfileDtoSchema)
                }
            }
        },
        ...withErrors([401, 404, 500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/users/{id}',
    tags: ['User'],
    summary: 'Get user by ID',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(userProfilePublicDtoSchema)
                }
            }
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/users/{id}/followers',
    tags: ['User'],
    summary: 'Get user followers',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema,
        query: paginationQuery
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(
                        userProfilePublicDtoSchema
                    )
                }
            }
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'get',
    path: '/users/{id}/following',
    tags: ['User'],
    summary: 'Get user following',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema,
        query: paginationQuery
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponsePaginatedSchema(
                        userProfilePublicDtoSchema
                    )
                }
            }
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'post',
    path: '/users/{id}/follow',
    tags: ['User'],
    summary: 'Follow user',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        204: {
            description: 'Successful response'
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'delete',
    path: '/users/{id}/follow',
    tags: ['User'],
    summary: 'Unfollow user',
    security: [{ bearerAuth: [] }],
    request: {
        params: idParamSchema
    },
    responses: {
        204: {
            description: 'Successful response'
        },
        ...withErrors([401, 500])
    }
})

registry.registerPath({
    method: 'patch',
    path: '/users/avatar',
    tags: ['User'],
    summary: 'Update user avatar',
    security: [{ bearerAuth: [] }],
    request: {
        body: {
            content: {
                'multipart/form-data': {
                    schema: z.object({
                        avatar: z.string().openapi({
                            type: 'string',
                            format: 'binary',
                            description: 'File (jpg, png, etc.)'
                        })
                    })
                }
            }
        }
    },
    responses: {
        200: {
            description: 'Successful response',
            content: {
                'application/json': {
                    schema: ApiResponseSchema(updateAvatarResponseDtoSchema)
                }
            }
        },
        ...withErrors([401, 500])
    }
})
