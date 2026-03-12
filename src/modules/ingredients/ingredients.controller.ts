import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { type Request, type Response } from 'express'
import IngredientsService from './ingredients.service'
import type { IngredientDto } from './dto/ingreient.dto'
import {
    limitSchema,
    pageSchema
} from '../../shared/http/schemas/pagination.schema'

class IngredientsController {
    constructor(private readonly ingredientsService: IngredientsService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<IngredientDto[]>>
    ) => {
        const { page } = pageSchema.parse(req.query)
        const { limit } = limitSchema.parse(req.query)

        const ingredients = await this.ingredientsService.getIngredients(
            page,
            limit
        )

        res.json({ data: ingredients })
    }
}

export const ingredientsController = new IngredientsController(
    new IngredientsService()
)
