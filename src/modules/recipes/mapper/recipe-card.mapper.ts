import type { Prisma } from '@prisma/client'
import type { RecipeCardDto } from '../dto/recipe-card.dto'
import type { recipeCardSelect } from '../recipes.service'
import { buildResponsiveImageUrls } from '../../../shared/fileUpload/cloudinary'

type RecipeCardPrismaSelect = Prisma.RecipeGetPayload<{
    select: typeof recipeCardSelect
}>

export const recipeCardMapper = (
    recipe: RecipeCardPrismaSelect
): RecipeCardDto => ({
    id: recipe.id,
    title: recipe.title,
    instructions: recipe.instructions,
    ownerId: recipe.owner.id,
    ownerAvatarURL: recipe.owner.avatarURL,
    ownerName: recipe.owner.name,
    image: {
        original: recipe.imageURL,
        ...buildResponsiveImageUrls(recipe.imagePublicId || '', recipe.imageURL)
    }
})
