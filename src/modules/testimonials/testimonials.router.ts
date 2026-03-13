import { Router } from 'express'
import { testimonialsController } from './testimonials.controller'

const testimonialsRouter = Router()

testimonialsRouter.get('/', testimonialsController.getIngredients)

export default testimonialsRouter
