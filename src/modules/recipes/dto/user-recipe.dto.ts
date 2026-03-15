import { registry } from '../../../shared/api-docs/swagger'
import { recipeDtoSchema } from './recipe.dto'
import { z } from 'zod'

export const userRecipeDtoSchema = registry.register(
    'UserRecipeDto',
    recipeDtoSchema.pick({
        title: true,
        instructions: true,
        image: true
    })
)

export type UserRecipeDto = z.infer<typeof userRecipeDtoSchema>
