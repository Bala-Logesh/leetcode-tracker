import { Router } from 'express'
import {
  addAttemptDates,
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
router.patch('/:problemId/attempts', addAttemptDates)
router.delete('/:problemId', deleteProblem)

export default router
