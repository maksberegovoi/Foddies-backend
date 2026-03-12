import { Router } from 'express'
import { ingredientsController } from './ingredients.controller'

const ingredientsRouter = Router()

ingredientsRouter.get('/', ingredientsController.getIngredients)

export default ingredientsRouter
