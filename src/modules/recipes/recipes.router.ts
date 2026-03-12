import { Router } from 'express'
import { recipesController } from './recipes.controller'

const recipesRouter = Router()

recipesRouter.get('/popular', recipesController.getPopular)

export default recipesRouter
