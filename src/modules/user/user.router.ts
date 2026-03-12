import { Router } from 'express'
import { userController } from './user.controller'
import { uploadHandler } from '../../shared/http/middlewares/upload-handler.middleware'

const userRouter = Router()

userRouter.get('/current/:id', userController.current)
userRouter.get('/followers/:id', userController.followers)
userRouter.get('/following/:id', userController.following)
userRouter.patch('/follow/:id', userController.follow)
userRouter.patch('/unfollow/:id', userController.unfollow)
userRouter.patch(
    '/avatar',
    uploadHandler.single('avatar'),
    userController.updateAvatar
)

export default userRouter
