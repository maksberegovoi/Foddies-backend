import { Router } from 'express'
import { categoriesController } from './categories.controller'

const categoriesRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Категорії рецептів
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Отримати список всіх категорій рецептів
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорій
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: Салати
 */
categoriesRouter.get('/', categoriesController.getCategories)

export default categoriesRouter
