import { Router } from 'express'
import { recipesController } from './recipes.controller'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'
import { uploadHandler } from '../../shared/http/middlewares/upload-handler.middleware'

const recipesRouter = Router()


recipesRouter.get('/', recipesController.getAll)


recipesRouter.get(
    '/my',
    authenticateMiddleware,
    recipesController.getUserRecipes
)


recipesRouter.get('/popular', recipesController.getPopular)

recipesRouter.get(
    '/favorite',
    authenticateMiddleware,
    recipesController.getFavorite
)

recipesRouter.get('/:id', recipesController.getById)

recipesRouter.post(
    '/:id/favorite',
    authenticateMiddleware,
    recipesController.addFavorite
)


recipesRouter.delete(
    '/:id/favorite',
    authenticateMiddleware,
    recipesController.removeFavorite
)

recipesRouter.post(
    '/',
    authenticateMiddleware,
    uploadHandler.single('image'),
    recipesController.create
)
recipesRouter.delete('/:id', authenticateMiddleware, recipesController.delete)

export default recipesRouter
