import { Router } from 'express'
import {
  createProblem,
  deleteProblem,
  getProblemById,
  getProblems,
  updateProblem,
} from '../controllers/problems.controller'

const router = Router()
router.get('/', getProblems)
router.get('/:problemId', getProblemById)
router.post('/', createProblem)
router.put('/:problemId', updateProblem)
router.delete('/:problemId', deleteProblem)

export default router
