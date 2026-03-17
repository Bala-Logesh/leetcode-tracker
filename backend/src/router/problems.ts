import { Router } from 'express'
import { createProblem, getProblems } from '../controllers/problems.controller'

const router = Router()
router.get('/', getProblems)
router.post('/', createProblem)

export default router
