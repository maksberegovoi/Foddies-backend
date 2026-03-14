import type { ApiResponse } from '../../shared/http/types/api-response.type'
import { type Request, type Response } from 'express'
import IngredientsService from './ingredients.service'
import type { IngredientDto } from './dto/ingredient.dto'

class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<IngredientDto[]>>
    ) => {
        const ingredients = await this.ingredientsService.getIngredients()

        res.json({ data: ingredients })
    }
}

export const ingredientsController = new IngredientsController(
    new IngredientsService()
)
