import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { type Request, type Response } from 'express'
import IngredientsService from './ingredients.service'
import type { IngredientDto } from './dto/ingreient.dto'

class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<IngredientDto[]>>
    ) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const ingredient = await this.ingredientsService.getIngredients(
            page,
            limit
        )

        res.json({ data: ingredient || [] })
    }
}

export const ingredientsController = new IngredientsController(
    new IngredientsService()
)
