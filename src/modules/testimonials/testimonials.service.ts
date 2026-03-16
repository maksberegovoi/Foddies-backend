import prisma from '../../prisma'
import { type TestimonialDto } from './dto/testimonials.dto'

class TestimonialsService {
    async getAll(limit: number): Promise<TestimonialDto[]> {
        return prisma.testimonial.findMany({
            select: {
                id: true,
                owner: true,
                text: true
            },
            take: limit,
            orderBy: {
                createdAt: 'desc'
            }
        })
    }
}

export default TestimonialsService
