import prisma from '../../prisma'
import { AreaDto } from './dto/areas-response.dto'

class AreasService {
    async getAll(): Promise<AreaDto[]> {
        return prisma.area.findMany()
    }
}

export default AreasService
