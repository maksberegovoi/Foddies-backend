import prisma from '../../prisma'
import type { ingredientsDto } from './dto/ingreient.dto.ts'

class IngredientService {
    async getIngredients(
        page: number,
        limit: number = 10
    ): Promise<ingredientsDto[]> {
        const skip = (page - 1) * limit
        return await prisma.ingredient.findMany({
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

export default IngredientService
