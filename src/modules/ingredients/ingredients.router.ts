import { Router } from 'express'
import { ingredientController } from './ingredients.controller'

const ingredientsRouter = Router()

ingredientsRouter.get('/', ingredientController.getIngredients)

export default ingredientsRouter
