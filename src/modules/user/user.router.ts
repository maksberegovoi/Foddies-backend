import { Router } from 'express'
import { userController } from './user.controller'

const userRouter = Router()

userRouter.post('/', userController.create)

export default userRouter
