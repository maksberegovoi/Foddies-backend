import prisma from '../../prisma'
import type { IngredientDto } from './dto/ingreient.dto.ts'

class IngredientsService {
    async getIngredients(
        page: number = 1,
        limit: number = 10
    ): Promise<IngredientDto[]> {
        const skip = (page - 1) * limit
        return prisma.ingredient.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                imageURL: true
            },
            skip: skip,
            take: limit,
            orderBy: {
                name: 'asc'
            }
        })
    }
}

export default IngredientsService
