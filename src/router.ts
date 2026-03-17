import express from 'express'
import userRouter from './modules/user/user.router.js'
import authRouter from './modules/auth/auth.router.js'
import categoriesRouter from './modules/categories/categories.router.js'
import ingredientsRouter from './modules/ingredients/ingredients.router.js'
import testimonialsRouter from './modules/testimonials/testimonials.router.js'
import areasRouter from './modules/areas/areas.router.js'
import recipesRouter from './modules/recipes/recipes.router'

const router = express.Router()

router.use('/users', userRouter)
router.use('/auth', authRouter)
router.use('/categories', categoriesRouter)
router.use('/ingredients', ingredientsRouter)
router.use('/testimonials', testimonialsRouter)
router.use('/areas', areasRouter)
router.use('/recipes', recipesRouter)

export default router
