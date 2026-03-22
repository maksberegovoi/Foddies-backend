import { registry } from '../../../shared/api-docs/swagger'
import { z } from 'zod'

export const userDtoSchema = registry.register(
    'UserDto',
    z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        avatarURL: z.string().nullable()
    })
)
export const userProfileDtoSchema = registry.register(
    'UserProfileDto',
    userDtoSchema.extend({
        totalRecipes: z.number(),
        totalFollowers: z.number(),
        totalFavoriteRecipes: z.number(),
        totalFollowing: z.number()
    })
)
export const userProfilePublicDtoSchema = registry.register(
    'UserProfilePublicDto',
    userProfileDtoSchema
        .omit({
            totalFavoriteRecipes: true,
            totalFollowing: true
        })
        .extend({
            isFollowing: z.boolean()
        })
)

export type UserDto = z.infer<typeof userDtoSchema>
export type UserProfileDto = z.infer<typeof userProfileDtoSchema>
export type UserProfilePublicDto = z.infer<typeof userProfilePublicDtoSchema>
