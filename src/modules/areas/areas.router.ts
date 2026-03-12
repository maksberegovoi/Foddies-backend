import { Router } from 'express'
import { areasController } from './areas.controller'

const areasRouter = Router()

areasRouter.get('/', areasController.getAll)

export default areasRouter
