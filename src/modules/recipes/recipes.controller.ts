import { type Request, type Response } from 'express'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import RecipesService from './recipes.service'
import { RecipeCardDto } from './dto/recipe-card.dto'
import { RecipeDto } from './dto/recipe.dto'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'
import { createRecipeSchema } from './dto/create-recipe.dto'

class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    getAll = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        //TODO: filters
        const recipes = await this.recipesService.getAll()
        res.json({ data: recipes })
    }
    getById = async (req: Request, res: Response<ApiResponse<any>>) => {
        const { id } = idParamSchema.parse(req.params)
        const recipe = await this.recipesService.getById(id)
        res.json({ data: recipe })
    }
    getPopular = async (req: Request, res: Response<ApiResponse<any>>) => {
        const recipes = await this.recipesService.getPopular()
        res.json({ data: recipes })
    }
    getUserRecipes = async (req: Request, res: Response<ApiResponse<any>>) => {
        // const user = req.user
        const id = '64c8d958249fae54bae90bb8'
        const recipes = await this.recipesService.getUserRecipes(id)
        res.json({ data: null })
    }
    addFavorite = async (req: Request, res: Response<ApiResponse<any>>) => {
        // const user = req.user
        const userId = '64c8d958249fae54bae90bb8'
        const { id: recipeId } = idParamSchema.parse(req.body)
        await this.recipesService.addFavorite(recipeId, userId)

        res.sendStatus(200)
    }
    removeFavorite = async (req: Request, res: Response<ApiResponse<any>>) => {
        // const user = req.user
        const userId = '64c8d958249fae54bae90bb8'
        const { id: recipeId } = idParamSchema.parse(req.body)
        await this.recipesService.removeFavorite(recipeId, userId)
        res.json({ data: null })
    }
    create = async (req: Request, res: Response<ApiResponse<any>>) => {
        // const user = req.user
        const userId = '64c8d958249fae54bae90bb8'
        const data = createRecipeSchema.parse(req.body)
        const recipe = await this.recipesService.create(data, userId)
        res.json({ data: recipe })
    }
    delete = async (req: Request, res: Response<ApiResponse<any>>) => {
        // const user = req.user
        const userId = '64c8d958249fae54bae90bb8'
        const { id: recipeId } = idParamSchema.parse(req.params)
        await this.recipesService.delete(recipeId, userId)
        res.sendStatus(200)
    }
}

export const recipesController = new RecipesController(new RecipesService())
