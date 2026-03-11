import ApiError from '../../shared/http/errors/api.error'
import ingredientsService from './ingredients.service'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import type { Ingredient } from '@prisma/client'
import { type Request, type Response } from 'express'

export const getIngredientsController = async (
    req: Request,
    res: Response<ApiResponse<Ingredient[]>>
) => {
    const result = await ingredientsService.getIngredients()

    if (!result || result.length === 0) {
        throw ApiError.badRequest('Ingredients not found in the database')
    }

    res.json({ data: result })
}
