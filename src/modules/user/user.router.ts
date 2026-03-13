import { Router } from 'express'
import { userController } from './user.controller'
import { uploadHandler } from '../../shared/http/middlewares/upload-handler.middleware'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const userRouter = Router()

userRouter.use(authenticateMiddleware)

userRouter.get('/current', userController.current)
userRouter.get('/followers', userController.followers)
userRouter.get('/following', userController.following)
userRouter.post('/follow', userController.follow)
userRouter.delete('/unfollow', userController.unfollow)
userRouter.patch(
    '/avatar',
    uploadHandler.single('avatar'),
    userController.updateAvatar
)

export default userRouter
