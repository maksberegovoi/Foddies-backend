import prisma from '../../prisma'
import type { AreaDto } from './dto/areas-response.dto'

class AreasService {
    async getAll(): Promise<AreaDto[]> {
        return prisma.area.findMany({
            select: {
                id: true,
                name: true
            },
            orderBy: {
                name: 'asc'
            }
        })
    }
}

export default AreasService
