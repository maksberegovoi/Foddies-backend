import type { RecipeDto } from './recipe.dto'

export type RecipeCardDto = Omit<
    RecipeDto,
    'description' | 'ingredients' | 'time' | 'category' | 'area'
>
