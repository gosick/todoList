import { Router } from 'express'
import todoList from './todo'

const router = Router()

router.use(todoList)

export default router