import { registry } from '../../../shared/api-docs/swagger'
import type { z } from '../../../shared/api-docs/swagger'
import { userProfileDtoSchema } from '../../user/dto/user.dto'

export const signInResponseSchema = registry.register(
    'SignInResponseDto',
    userProfileDtoSchema
)

export type SignInResponseDto = z.infer<typeof signInResponseSchema>
