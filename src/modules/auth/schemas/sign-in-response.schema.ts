import { registry, z } from '../../../shared/api-docs/swagger'
import { userProfileDtoSchema } from '../../user/dto/user.dto'

export const signInResponseSchema = registry.register(
    'SignInResponseDto',
    userProfileDtoSchema.extend({
        token: z.string()
    })
)

export type SignInResponseDto = z.infer<typeof signInResponseSchema>
