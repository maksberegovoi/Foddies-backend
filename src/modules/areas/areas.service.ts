import prisma from '../../prisma'

import type { AreasResponseDto } from './dto/areas-response.dto'

class AreasService {
    async getAll(): Promise<AreasResponseDto> {
        return prisma.area.findMany()
    }
}

export default AreasService
