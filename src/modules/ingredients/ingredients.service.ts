import prisma from '../../prisma'
import type { IngredientDto } from './dto/ingredient.dto'

class IngredientsService {
    async getIngredients(): Promise<IngredientDto[]> {
        return prisma.ingredient.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageURL: true
            },
            orderBy: {
                name: 'asc'
            }
        })
    }
}

export default IngredientsService
