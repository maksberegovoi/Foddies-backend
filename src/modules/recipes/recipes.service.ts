import prisma from '../../prisma'
import { createRecipeDto } from './schemas/create-recipe.schema'
import { RecipeCardDto } from './dto/recipe-card.dto'
import { RecipeDto } from './dto/recipe.dto'
import ApiError from '../../shared/http/errors/api.error'

// npm run typecheck
// npx lint-staged

class RecipesService {
    async getAll(): Promise<RecipeCardDto[]> {
        const recipes = await prisma.recipe.findMany({
            select: {
                id: true,
                title: true,
                instructions: true,
                owner: {
                    select: {
                        id: true,
                        avatarURL: true,
                        name: true
                    }
                },
                imageURL: true
            }
        })

        return recipes.map((recipe) => ({
            id: recipe.id,
            title: recipe.title,
            instructions: recipe.instructions,
            imageURL: recipe.imageURL,
            ownerId: recipe.owner.id,
            ownerAvatarURL: recipe.owner.avatarURL,
            ownerName: recipe.owner.name
        }))
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
            select: {
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
            }
        })

        return recipes.map((recipe) => ({
            id: recipe.id,
            title: recipe.title,
            instructions: recipe.instructions,
            imageURL: recipe.imageURL,
            ownerId: recipe.owner.id,
            ownerAvatarURL: recipe.owner.avatarURL,
            ownerName: recipe.owner.name
        }))
    }
    async getUserRecipes(userId: string) {
        return prisma.recipe.findMany({
            where: { ownerId: userId }
        })
    }
    async addFavorite(recipeId: string, userId: string) {
        return prisma.recipe.update({
            where: { id: recipeId },
            data: {
                favoritedBy: {
                    disconnect: { id: userId }
                }
            }
        })
    }
    async removeFavorite(recipeId: string, userId: string) {
        return prisma.recipe.update({
            where: { id: recipeId },
            data: {
                favoritedBy: {
                    connect: { id: userId }
                }
            }
        })
    }
    async create(data: createRecipeDto, userId: string) {
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
        await prisma.recipe.delete({
            where: { id: recipeId, ownerId: userId }
        })
    }
}

export default RecipesService
