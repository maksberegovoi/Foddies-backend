import { Router } from 'express'
import { authController } from './auth.controller'
import authenticateMiddleware from '../../shared/http/middlewares/authenticate.middleware'

const authRouter = Router()

authRouter.post('/signup', authController.signUp)
authRouter.post('/signin', authController.signIn)
authRouter.post('/signout', authenticateMiddleware, authController.signOut)

export default authRouter
