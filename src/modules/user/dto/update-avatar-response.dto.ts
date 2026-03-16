import { registry } from '../../../shared/api-docs/swagger'
import { z } from 'zod'

export const updateAvatarResponseDtoSchema = registry.register(
    'UpdateAvatarResponseDto',
    z.object({
        avatarUrl: z.string().nullable()
    })
)

export type UpdateAvatarResponseDto = z.infer<
    typeof updateAvatarResponseDtoSchema
>
