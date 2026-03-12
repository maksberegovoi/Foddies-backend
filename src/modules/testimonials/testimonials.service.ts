import prisma from '../../prisma'
import { type TestimonialDto } from './dto/testimonials.dto'

class TestimonialsService {
    async getTestimonials(
        page: number = 1,
        limit: number = 10
    ): Promise<TestimonialDto[]> {
        const skip = (page - 1) * limit
        return prisma.testimonial.findMany({
            select: {
                id: true,
                owner: true,
                text: true
            },
            skip: skip,
            take: limit
        })
    }
}

export default TestimonialsService
