import prisma from '../../prisma'
import type { CategoryDto } from './dto/category.dto'

class CategoriesService {
    async getCategories(): Promise<CategoryDto[]> {
        return prisma.category.findMany({
            select: {
                id: true,
                name: true,
                description: true
            },
            orderBy: {
                name: 'asc'
            }
        })
    }
}

export default CategoriesService
