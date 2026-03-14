import { Router } from 'express'
import { testimonialsController } from './testimonials.controller'

const testimonialsRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Testimonials
 *   description: Відгуки користувачів
 */

/**
 * @swagger
 * /testimonials:
 *   get:
 *     summary: Отримати список відгуків
 *     tags: [Testimonials]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Максимальна кількість відгуків для повернення
 *     responses:
 *       200:
 *         description: Список відгуків
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TestimonialsResponse'
 */

testimonialsRouter.get('/', testimonialsController.getIngredients)

export default testimonialsRouter
