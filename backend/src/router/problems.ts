import { Router } from 'express'
import { createProblem, getProblemById, getProblems } from '../controllers/problems.controller'

const router = Router()
router.get('/', getProblems)
router.get('/:problemId', getProblemById)
router.post('/', createProblem)

export default router
