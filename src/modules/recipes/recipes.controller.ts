import { type Request, type Response } from 'express'
import type { ApiResponse } from '../../shared/http/types/api-response.type'
import RecipesService from './recipes.service'
import type { RecipeCardDto } from './dto/recipe-card.dto'
import { idParamSchema } from '../../shared/http/schemas/idParam.schema'
import { getRecipesQuerySchema } from './schemas/param-filters.schema'
import { type RecipeDto } from './dto/recipe.dto'
import { createRecipeSchema } from './schemas/create-recipe.schema'
import type { ApiResponsePaginated } from '../../shared/http/types/api-response-paginated.type'

class RecipesController {
    constructor(private readonly recipesService: RecipesService) {}

    getAll = async (
        req: Request,
        res: Response<ApiResponsePaginated<RecipeCardDto>>
    ) => {
        const query = getRecipesQuerySchema.parse(req.query)
        const result = await this.recipesService.getAll(query)
        res.json({
            data: result.items,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit
            }
        })
    }
    getById = async (req: Request, res: Response<ApiResponse<RecipeDto>>) => {
        const { id } = idParamSchema.parse(req.params)
        const recipe = await this.recipesService.getById(id)
        res.json({ data: recipe })
    }
    getPopular = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        const recipes = await this.recipesService.getPopular()
        res.json({ data: recipes })
    }
    getUserRecipes = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        const { id: userId } = req.user
        const recipes = await this.recipesService.getUserRecipes(userId)
        res.json({ data: recipes })
    }
    getFavorite = async (
        req: Request,
        res: Response<ApiResponse<RecipeCardDto[]>>
    ) => {
        const { id: userId } = req.user
        const recipes = await this.recipesService.getFavorite(userId)
        res.json({ data: recipes })
    }
    addFavorite = async (req: Request, res: Response) => {
        const { id: userId } = req.user
        const { id: recipeId } = idParamSchema.parse(req.params)
        await this.recipesService.addFavorite(recipeId, userId)

        res.sendStatus(204)
    }
    removeFavorite = async (req: Request, res: Response) => {
        const { id: userId } = req.user
        const { id: recipeId } = idParamSchema.parse(req.params)
        await this.recipesService.removeFavorite(recipeId, userId)
        res.sendStatus(204)
    }
    create = async (
        req: Request,
        res: Response<ApiResponse<{ id: string }>>
    ) => {
        const { id: userId } = req.user
        const data = createRecipeSchema.parse(req.body)
        const recipeId = await this.recipesService.create(data, userId)
        res.json({ data: recipeId })
    }
    delete = async (req: Request, res: Response) => {
        const { id: userId } = req.user
        const { id: recipeId } = idParamSchema.parse(req.params)
        await this.recipesService.delete(recipeId, userId)
        res.sendStatus(204)
    }
}

export const recipesController = new RecipesController(new RecipesService())
