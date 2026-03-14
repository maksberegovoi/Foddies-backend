import { Router } from 'express'
import { recipesController } from './recipes.controller'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const recipesRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Рецепти
 */

/**
 * @swagger
 * /recipes:
 *   get:
 *     summary: Отримати список рецептів (з пагінацією)
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Номер сторінки
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *         required: false
 *         description: Кількість рецептів на сторінці
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: false
 *         description: Фільтр за категорією
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         required: false
 *         description: Фільтр за інгредієнтом
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         required: false
 *         description: Фільтр за регіоном походження страви
 *     responses:
 *       200:
 *         description: Пагінований список рецептів
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponseRecipeCard'
 */
recipesRouter.get('/', recipesController.getAll)

/**
 * @swagger
 * /recipes/my:
 *   get:
 *     summary: Отримати рецепти поточного користувача
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Список рецептів поточного користувача
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeCard'
 */
recipesRouter.get(
    '/my',
    authenticateMiddleware,
    recipesController.getUserRecipes
)

/**
 * @swagger
 * /recipes/popular:
 *   get:
 *     summary: Отримати список популярних рецептів
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Масив популярних рецептів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeCard'
 */
recipesRouter.get('/popular', recipesController.getPopular)

/**
 * @swagger
 * /recipes/favorite:
 *   get:
 *     summary: Отримати улюблені рецепти поточного користувача
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Масив улюблених рецептів
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecipeCard'
 */
recipesRouter.get(
    '/favorite',
    authenticateMiddleware,
    recipesController.getFavorite
)

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Отримати деталі рецепту за ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Детальна інформація про рецепт
 */
recipesRouter.get('/:id', recipesController.getById)

/**
 * @swagger
 * /recipes/{id}/favorite:
 *   post:
 *     summary: Додати рецепт до улюблених
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Рецепт додано до улюблених
 */
recipesRouter.post(
    '/:id/favorite',
    authenticateMiddleware,
    recipesController.addFavorite
)

/**
 * @swagger
 * /recipes/{id}:
 *   get:
 *     summary: Отримати детальний рецепт за ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепту
 *     responses:
 *       200:
 *         description: Детальна інформація про рецепт
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseRecipe'
 */
recipesRouter.delete(
    '/:id/favorite',
    authenticateMiddleware,
    recipesController.removeFavorite
)

/**
 * @swagger
 * /recipes:
 *   post:
 *     summary: Створити новий рецепт
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecipeRequest'
 *     responses:
 *       200:
 *         description: Повертає ID створеного рецепту
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateRecipeResponse'
 */
recipesRouter.post('/', authenticateMiddleware, recipesController.create)

/**
 * @swagger
 * /recipes/{id}:
 *   delete:
 *     summary: Видалити рецепт користувача
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID рецепту, який потрібно видалити
 *     responses:
 *       204:
 *         description: Рецепт успішно видалено (No Content)
 */
recipesRouter.delete('/:id', authenticateMiddleware, recipesController.delete)

export default recipesRouter
