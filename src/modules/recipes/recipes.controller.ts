import { type Request, type Response } from 'express'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import RecipesService from './recipes.service'
import { RecipeCardDto } from './dto/recipe-card.dto'

class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}
    getPopular = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        const recipes = await this.recipesService.getPopular()

        res.json({ data: recipes })
    }
}

export const recipesController = new RecipesController(new RecipesService())
