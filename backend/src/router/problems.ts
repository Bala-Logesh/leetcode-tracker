import { Router } from 'express'
import {
  createProblem,
  deleteProblem,
  getProblemById,
  getProblems,
} from '../controllers/problems.controller'

const router = Router()
router.get('/', getProblems)
router.get('/:problemId', getProblemById)
router.post('/', createProblem)
router.delete('/:problemId', deleteProblem)

export default router
