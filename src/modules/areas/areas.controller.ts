import type { Request, Response } from 'express'
import AreasService from './areas.service'
import { AreaDto } from './dto/areas-response.dto'
import type { ApiResponse } from '../../shared/http/types/api-response.type'

class AreasController {
    constructor(private readonly areasService: AreasService) {}

    getAll = async (req: Request, res: Response<ApiResponse<AreaDto[]>>) => {
        const areas = await this.areasService.getAll()
        return res.json({ data: areas })
    }
}

export const areasController = new AreasController(new AreasService())
