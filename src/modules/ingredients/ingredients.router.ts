import { Router } from 'express'
import { ingredientsController } from './ingredients.controller'

const ingredientsRouter = Router()
/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Список інгредієнтів
 */

/**
 * @swagger
 * /ingredients:
 *   get:
 *     summary: Отримати список інгредієнтів
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: Список інгредієнтів
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IngredientsResponse'
 */
ingredientsRouter.get('/', ingredientsController.getIngredients)

export default ingredientsRouter
