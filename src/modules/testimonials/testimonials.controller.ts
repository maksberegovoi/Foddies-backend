import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { type Request, type Response } from 'express'
import TestimonialsService from './testimonials.service'
import type { TestimonialDto } from './dto/testimonials.dto'
import { limitSchema } from '../../shared/http/schemas/pagination.schema'

class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<TestimonialDto[]>>
    ) => {
        const { limit } = limitSchema.parse(req.query)

        const testimonials =
            await this.testimonialsService.getTestimonials(limit)

        res.json({ data: testimonials })
    }
}

export const testimonialsController = new TestimonialsController(
    new TestimonialsService()
)
