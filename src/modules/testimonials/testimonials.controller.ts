import type { ApiResponse } from '../../shared/http/types/api-response.interface'
import { type Request, type Response } from 'express'
import TestimonialsService from './testimonials.service'
import type { TestimonialDto } from './dto/testimonials.dto'

class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) {}
    getIngredients = async (
        req: Request,
        res: Response<ApiResponse<TestimonialDto[]>>
    ) => {
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const testimonial = await this.testimonialsService.getTestimonials(
            page,
            limit
        )

        res.json({ data: testimonial || [] })
    }
}

export const testimonialsController = new TestimonialsController(
    new TestimonialsService()
)
