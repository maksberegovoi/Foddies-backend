import { recipeDtoSchema } from './recipe.dto'
import { registry } from '../../../shared/api-docs/swagger'
import { z } from 'zod'

export const recipeCardSchema = registry.register(
    'RecipeCardDto',
    recipeDtoSchema.omit({
        description: true,
        ingredients: true,
        time: true,
        category: true,
        area: true
    })
)

export type RecipeCardDto = z.infer<typeof recipeCardSchema>
