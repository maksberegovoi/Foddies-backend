import { Router } from 'express'
import { userController } from './user.controller'
import { uploadHandler } from '../../shared/http/middlewares/upload-handler.middleware'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const userRouter = Router()

userRouter.use(authenticateMiddleware)

userRouter.get('/current', userController.current)
userRouter.get('/following', userController.following)
userRouter.get('/:id', userController.getUserById)
userRouter.get('/:id/followers', userController.followers)
userRouter.post('/:id/follow', userController.follow)
userRouter.delete('/:id/follow', userController.unfollow)
userRouter.patch(
    '/avatar',
    uploadHandler.single('avatar'),
    userController.updateAvatar
)

export default userRouter
