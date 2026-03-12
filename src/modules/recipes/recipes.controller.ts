import { type Request, type Response } from 'express'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import RecipesService from './recipes.service'
import { RecipeCardDto } from './dto/recipe-card.dto'
import { RecipeDto } from './dto/recipe.dto'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'

class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    getAll = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        const recipes = await this.recipesService.getAll()
        res.json({ data: recipes })
    }
    getById = async (req: Request, res: Response<ApiResponse<any>>) => {
        const id = idParamSchema.parse(req.params)
        const recipe = await this.recipesService.getById(id)
        res.json({ data: recipe })
    }
    getPopular = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
    getUserRecipes = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
    addFavorite = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
    removeFavorite = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
    create = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
    delete = async (req: Request, res: Response<ApiResponse<any>>) => {
        res.json({ data: null })
    }
}

export const recipesController = new RecipesController(new RecipesService())
