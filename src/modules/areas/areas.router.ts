import { Router } from 'express'
import { areasController } from './areas.controller'

const areasRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Areas
 *   description: Регіони походження страв
 */

/**
 * @swagger
 * /areas:
 *   get:
 *     summary: Отримати список всіх регіонів
 *     tags: [Areas]
 *     responses:
 *       200:
 *         description: Список регіонів
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AreasResponse'
 */
areasRouter.get('/', areasController.getAll)

export default areasRouter
