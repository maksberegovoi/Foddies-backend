import type { NextFunction, Request, Response } from 'express';
import  AreasService from './areas.service';

class AreasController {
    constructor(private readonly areasService: AreasService) {}

    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const areas = await this.areasService.getAll();
            return res.json(areas);
        } catch (error) {
            next(error);
        }
    };
}

export const areasController = new AreasController(new AreasService());