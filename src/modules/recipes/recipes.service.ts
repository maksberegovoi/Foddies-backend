import prisma from '../../prisma'
import { createRecipeDto } from './schemas/create-recipe.schema'
import { RecipeCardDto } from './dto/recipe-card.dto'

// npm run typecheck
// npx lint-staged

class RecipesService {
    async getAll() {}
    async getById(recipeId: string): Promise<RecipeCardDto> {
        return prisma.recipe.findUnique({
            where: { id: recipeId }
        })
    }
    async getPopular(
        limit: number = 4,
        // TODO: remove default
        userId?: string = '64c8d958249fae54bae90bb8'
    ): Promise<RecipeCardDto[]> {
        const recipes = await prisma.recipe.findMany({
            orderBy: {
                favoritedBy: {
                    _count: 'desc'
                }
            },
            take: limit,
            select: {
                owner: {
                    select: {
                        id: true,
                        avatarURL: true,
                        name: true
                    }
                },
                imageURL: true,
                title: true,
                instructions: true,
                favoritedBy: userId
                    ? { where: { id: userId }, select: { id: true } }
                    : false
            }
        })

        return recipes.map((recipe) => ({
            title: recipe.title,
            instructions: recipe.instructions,
            imageURL: recipe.imageURL,
            ownerId: recipe.owner.id,
            ownerAvatarURL: recipe.owner.avatarURL,
            ownerName: recipe.owner.name,
            isFavorite:
                Array.isArray(recipe.favoritedBy) &&
                recipe.favoritedBy.length > 0
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
