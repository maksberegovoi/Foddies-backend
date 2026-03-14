import { Router } from 'express'
import { userController } from './user.controller'
import { uploadHandler } from '../../shared/http/middlewares/upload-handler.middleware'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const userRouter = Router()

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Користувачі
 */

userRouter.use(authenticateMiddleware)

/**
 * @swagger
 * /users/current:
 *   get:
 *     summary: Отримати поточного користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Поточний користувач
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfile'
 */
userRouter.get('/current', userController.current)

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Отримати публічний профіль іншого користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача
 *     responses:
 *       200:
 *         description: Публічний профіль користувача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfilePublic'
 */
userRouter.get('/:id', userController.getUserById)

/**
 * @swagger
 * /users/{id}/followers:
 *   get:
 *     summary: Отримати користувачів, що слідкують за користувачем
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Номер сторінки
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *         required: false
 *         description: Кількість елементів на сторінці
 *     responses:
 *       200:
 *         description: Пагінований список підписників
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponseUserProfilePublic'
 */
userRouter.get('/:id/followers', userController.followers)

/**
 * @swagger
 * /users/{id}/following:
 *   get:
 *     summary: Отримати користувачів, за якими слідкує користувач
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *         required: false
 *         description: Номер сторінки
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: number
 *         required: false
 *         description: Кількість елементів на сторінці
 *     responses:
 *       200:
 *         description: Пагінований список користувачів, за якими слідкує користувач
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponseUserProfilePublic'
 */
userRouter.get('/:id/following', userController.following)

/**
 * @swagger
 * /users/{id}/follow:
 *   post:
 *     summary: Підписатися на користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача, на якого підписуються
 *     responses:
 *       204:
 *         description: Користувач успішно підписаний (No Content)
 */
userRouter.post('/:id/follow', userController.follow)

/**
 * @swagger
 * /users/{id}/follow:
 *   delete:
 *     summary: Відписатися від користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID користувача, від якого відписуються
 *     responses:
 *       204:
 *         description: Користувач успішно відписаний (No Content)
 */
userRouter.delete('/:id/follow', userController.unfollow)

/**
 * @swagger
 * /users/avatar:
 *   patch:
 *     summary: Оновити аватарку користувача
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Файл аватарки
 *     responses:
 *       200:
 *         description: Новий URL аватарки користувача
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponseAvatar'
 */
userRouter.patch(
    '/avatar',
    uploadHandler.single('avatar'),
    userController.updateAvatar
)

export default userRouter
