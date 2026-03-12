import type { Request, Response } from 'express'
import AreasService from './areas.service'
import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import type { AreasResponseDto } from './dto/areas-response.dto'

class AreasController {
    constructor(private readonly areasService: AreasService) {}

    getAll = async (
        req: Request,
        res: Response<ApiResponse<AreasResponseDto>>
    ) => {
        const areas = await this.areasService.getAll()
        return res.json({ data: areas })
    }
}

export const areasController = new AreasController(new AreasService())
