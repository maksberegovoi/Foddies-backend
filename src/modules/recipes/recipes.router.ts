import { Router } from 'express'
import { recipesController } from './recipes.controller'

const recipesRouter = Router()

recipesRouter.get('/', recipesController.getAll)
recipesRouter.get('/:id', recipesController.getById)
recipesRouter.get('/popular', recipesController.getPopular)
recipesRouter.get('/my', recipesController.getUserRecipes) // authMw
recipesRouter.patch('/:id/favorite', recipesController.addFavorite) // authMw
recipesRouter.patch('/:id/unfavorite', recipesController.removeFavorite) // authMw
recipesRouter.post('/', recipesController.create) // authMw
recipesRouter.delete('/:id', recipesController.delete) // authMw

export default recipesRouter
