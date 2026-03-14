import { Router } from 'express'
import { authController } from './auth.controller'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const authRouter = Router()
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Авторизація користувачів
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Ivan Ivanov
 *               email:
 *                 type: string
 *                 example: ivan@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: Користувач успішно створений
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseUserDto'
 */
authRouter.post('/signup', authController.signUp)

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Логін користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Успішний логін
 *       401:
 *         description: Невірний логін або пароль
 */
authRouter.post('/signin', authController.signIn)

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Вихід користувача (logout)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Користувач успішно вийшов (No Content)
 */
authRouter.post('/signout', authenticateMiddleware, authController.signOut)

export default authRouter
