import prisma from '../../prisma'
import type { RecipeCardDto } from './dto/recipe-card.dto'
import type { RecipeDto } from './dto/recipe.dto'
import ApiError from '../../shared/http/errors/api.error'
import type { RecipesQuerySchema } from './schemas/param-filters.schema'
import type { Prisma } from '@prisma/client'
import { recipeCardMapper } from './mapper/recipe-card.mapper'
import type { GetAllRecipesDto } from './dto/get-all-recipes.dto'
import type { CreateRecipeDto } from './schemas/create-recipe.schema'
import { recipeFiltertingUtil } from './utils/recipe-filtering.util'

export const recipeCardSelect = {
    id: true,
    imageURL: true,
    title: true,
    instructions: true,
    owner: {
        select: {
            id: true,
            avatarURL: true,
            name: true
        }
    }
} as const satisfies Prisma.RecipeSelect

class RecipesService {
    async getAll(query: RecipesQuerySchema): Promise<GetAllRecipesDto> {
        const where = recipeFiltertingUtil(query)

        const limit = query.limit || 10
        const page = query.page || 1
        const skip = (page - 1) * limit

        const [recipes, total] = await prisma.$transaction([
            prisma.recipe.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                select: recipeCardSelect
            }),
            prisma.recipe.count({ where })
        ])

        return {
            items: recipes.map(recipeCardMapper),
            total,
            page,
            limit
        }
    }
    async getById(recipeId: string): Promise<RecipeDto> {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: {
                id: true,
                title: true,
                description: true,
                instructions: true,
                time: true,
                imageURL: true,
                owner: {
                    select: {
                        id: true,
                        avatarURL: true,
                        name: true
                    }
                },
                category: {
                    select: { name: true }
                },
                area: {
                    select: { name: true }
                },
                ingredients: {
                    select: {
                        measure: true,
                        ingredient: {
                            select: {
                                name: true,
                                imageURL: true
                            }
                        }
                    }
                }
            }
        })

        if (!recipe) {
            throw ApiError.notFound('Recipe not found')
        }

        return {
            id: recipe.id,
            title: recipe.title,
            description: recipe.description,
            instructions: recipe.instructions,
            time: recipe.time,
            imageURL: recipe.imageURL,
            category: recipe.category.name,
            area: recipe.area.name,
            ingredients: recipe.ingredients.map((i) => ({
                name: i.ingredient.name,
                imageURL: i.ingredient.imageURL,
                measure: i.measure
            })),
            ownerId: recipe.owner.id,
            ownerName: recipe.owner.name,
            ownerAvatarURL: recipe.owner.avatarURL
        }
    }
    async getPopular(limit: number = 4): Promise<RecipeCardDto[]> {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                favoritedBy: {
                    _count: 'desc'
                }
            },
            take: limit,
            select: recipeCardSelect
        })

        return recipes.map(recipeCardMapper)
    }
    async getUserRecipes(userId: string): Promise<RecipeCardDto[]> {
        const recipes = await prisma.recipe.findMany({
            where: { ownerId: userId },
            select: recipeCardSelect
        })

        return recipes.map(recipeCardMapper)
    }
    async getFavorite(userId: string): Promise<RecipeCardDto[]> {
        const recipes = await prisma.recipe.findMany({
            where: { favoritedBy: { some: { id: userId } } },
            select: recipeCardSelect
        })

        return recipes.map(recipeCardMapper)
    }
    async addFavorite(recipeId: string, userId: string) {
        await prisma.recipe.update({
            where: { id: recipeId },
            data: {
                favoritedBy: {
                    connect: { id: userId }
                }
            }
        })
    }
    async removeFavorite(recipeId: string, userId: string) {
        await prisma.recipe.update({
            where: { id: recipeId },
            data: {
                favoritedBy: {
                    disconnect: { id: userId }
                }
            }
        })
    }
    async create(data: CreateRecipeDto, userId: string) {
        return prisma.recipe.create({
            data: {
                title: data.title,
                description: data.description,
                instructions: data.instructions,
                time: data.time,
                imageURL: data.imageURL,
                ownerId: userId,
                categoryId: data.categoryId,
                areaId: data.areaId,
                ingredients: {
                    create: data.ingredients.map((i) => ({
                        measure: i.measure,
                        ingredientId: i.ingredientId
                    }))
                }
            },
            select: { id: true }
        })
    }
    async delete(recipeId: string, userId: string) {
        const recipe = await prisma.recipe.findUnique({
            where: { id: recipeId },
            select: { ownerId: true }
        })

        if (!recipe) {
            throw ApiError.notFound('Recipe not found')
        }

        if (recipe.ownerId !== userId) {
            throw ApiError.forbidden(
                'You are not allowed to delete this recipe'
            )
        }

        await prisma.recipe.delete({
            where: { id: recipeId }
        })
    }
}

export default RecipesService
