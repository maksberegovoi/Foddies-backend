import prisma from '../../prisma'
import type { RecipeCardDto } from './dto/recipe-card.dto'
import type { RecipeDto } from './dto/recipe.dto'
import ApiError from '../../shared/http/errors/api.error'
import type { RecipesQuerySchema } from './schemas/param-filters.schema'
import type { Prisma } from '@prisma/client'
import { recipeCardMapper } from './mapper/recipe-card.mapper'
import type { CreateRecipeDto } from './schemas/create-recipe.schema'
import { recipeFiltertingUtil } from './utils/recipe-filtering.util'
import type { PaginationType } from '../../shared/http/types/pagination.type'
import {
    buildResponsiveImageUrls,
    uploadToCloudinary
} from '../../shared/fileUpload/cloudinary'
import type { PaginationQuery } from '../user/schemas/pagination-query.schema'
import { UserRecipeDto } from './dto/user-recipe.dto'

export const recipeCardSelect = {
    id: true,
    imageURL: true,
    imagePublicId: true,
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

type UploadedRecipeImage = {
    imageURL: string
    imagePublicId: string
}

class RecipesService {
    async getAll(
        query: RecipesQuerySchema
    ): Promise<{ items: RecipeCardDto[] } & PaginationType> {
        const where = recipeFiltertingUtil(query)

        const { limit, page } = query
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
                imagePublicId: true,
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
            image: {
                original: recipe.imageURL,
                ...buildResponsiveImageUrls(
                    recipe.imagePublicId || '',
                    recipe.imageURL
                )
            },
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
    async getUserRecipes(
        query: PaginationQuery,
        userId: string
    ): Promise<{ items: UserRecipeDto[] } & PaginationType> {
        const { limit, page } = query
        const skip = (page - 1) * limit
        const [recipes, total] = await prisma.$transaction([
            prisma.recipe.findMany({
                where: { ownerId: userId },
                take: limit,
                skip,
                select: {
                    id: true,
                    title: true,
                    instructions: true,
                    imageURL: true,
                    imagePublicId: true
                }
            }),
            prisma.recipe.count({ where: { ownerId: userId } })
        ])

        return {
            items: recipes.map((i) => ({
                id: i.id,
                title: i.title,
                instructions: i.instructions,
                image: {
                    original: i.imageURL,
                    ...buildResponsiveImageUrls(
                        i.imagePublicId || '',
                        i.imageURL
                    )
                }
            })),
            page,
            limit,
            total
        }
    }
    async getFavorite(
        query: PaginationQuery,
        userId: string
    ): Promise<{ items: RecipeCardDto[] } & PaginationType> {
        const { limit, page } = query
        const skip = (page - 1) * limit
        const [recipes, total] = await prisma.$transaction([
            prisma.recipe.findMany({
                where: { favoritedBy: { some: { id: userId } } },
                take: limit,
                skip,
                select: recipeCardSelect
            }),
            prisma.recipe.count({
                where: { favoritedBy: { some: { id: userId } } }
            })
        ])

        return {
            items: recipes.map(recipeCardMapper),
            page,
            limit,
            total
        }
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
    async create(
        data: CreateRecipeDto,
        userId: string,
        file?: Express.Multer.File
    ) {
        const imageURL = await this.uploadImage(file)

        return prisma.recipe.create({
            data: {
                title: data.title,
                description: data.description,
                instructions: data.instructions,
                time: data.time,
                imageURL: imageURL.imageURL,
                imagePublicId: imageURL.imagePublicId,
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

    async uploadImage(
        file?: Express.Multer.File
    ): Promise<UploadedRecipeImage> {
        if (!file) {
            throw ApiError.badRequest('No file provided')
        }

        const imageURL = await uploadToCloudinary(file.buffer, 'recipes')

        return {
            imageURL: imageURL.originalUrl,
            imagePublicId: imageURL.publicId
        }
    }
}

export default RecipesService
