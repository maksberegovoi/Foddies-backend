import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { type Request, type Response } from 'express'
import IngredientService from './ingredients.service'
import type { ingredientsDto } from './dto/ingreient.dto'

class IngredientController {
    constructor(private readonly ingredientsService: IngredientService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<ingredientsDto[]>>
    ) => {
        const ingredient = await this.ingredientsService.getIngredients()

        res.json({ data: ingredient })
    }
}

export const ingredientController = new IngredientController(
    new IngredientService()
)
