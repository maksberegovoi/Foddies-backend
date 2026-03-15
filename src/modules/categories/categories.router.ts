import { Router } from 'express'
import { categoriesController } from './categories.controller'

const categoriesRouter = Router()

categoriesRouter.get('/', categoriesController.getCategories)

export default categoriesRouter
