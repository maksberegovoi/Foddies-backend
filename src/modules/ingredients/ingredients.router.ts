import { Router } from 'express'
import { getIngredientsController } from './ingredients.controller'

const ingredientsRouter = Router()

ingredientsRouter.get('/', getIngredientsController)

export default ingredientsRouter
