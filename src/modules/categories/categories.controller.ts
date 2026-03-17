import type { ApiResponse } from '../../shared/http/types/api-response.type'
import { type Request, type Response } from 'express'
import CategoriesService from './categories.service'
import type { CategoryDto } from './dto/category.dto'

class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
    getCategories = async (
        req: Request,
        res: Response<ApiResponse<CategoryDto[]>>
    ) => {
        const categories = await this.categoriesService.getCategories()

        res.json({ data: categories })
    }
}

export const categoriesController = new CategoriesController(
    new CategoriesService()
)
