import prisma from '../../prisma'
import { type TestimonialDto } from './dto/testimonials.dto'

class TestimonialsService {
    async getTestimonials(limit: number = 10): Promise<TestimonialDto[]> {
        return prisma.testimonial.findMany({
            select: {
                id: true,
                owner: true,
                text: true
            },
            take: limit
        })
    }
}

export default TestimonialsService
