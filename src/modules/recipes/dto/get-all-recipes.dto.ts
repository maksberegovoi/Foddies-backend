import type { RecipeCardDto } from './recipe-card.dto'

export interface GetAllRecipesDto {
    items: RecipeCardDto[]
    total: number
    page: number
    limit: number
}
