import prisma from '../../prisma'
import type { ingredientsDto } from './dto/ingreient.dto.ts'

class IngredientService {
    async getIngredients(): Promise<ingredientsDto[]> {
        return await prisma.ingredient.findMany({
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

export default IngredientService
