import type { Prisma } from '@prisma/client'
import type { RecipeCardDto } from '../dto/recipe-card.dto'
import type { recipeCardSelect } from '../recipes.service'

type RecipeCardPrismaSelect = Prisma.RecipeGetPayload<{
    select: typeof recipeCardSelect
}>

export const recipeCardMapper = (
    recipe: RecipeCardPrismaSelect
): RecipeCardDto => ({
    id: recipe.id,
    title: recipe.title,
    instructions: recipe.instructions,
    imageURL: recipe.imageURL,
    ownerId: recipe.owner.id,
    ownerAvatarURL: recipe.owner.avatarURL,
    ownerName: recipe.owner.name
})
