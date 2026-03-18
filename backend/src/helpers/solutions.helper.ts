import { Types } from 'mongoose'
import Solution from '../models/solutions'
import { ICreateSolution } from '../types/problem.types'

export const createSolution = async (
  problemId: Types.ObjectId,
  solutions: ICreateSolution
): Promise<Types.ObjectId> => {
  const solution = {
    problemId,
    solutions: solutions.solutions,
  }

  const createdSolution = await Solution.create(solution)

  return createdSolution._id
}

export const createSolutions = async (
  problemId: Types.ObjectId,
  solutions: ICreateSolution[]
): Promise<Types.ObjectId[]> => {
  const solutionDocs = solutions.map((sol) => ({
    problemId,
    solutions: sol.solutions,
  }))

  const createdDocs = await Solution.insertMany(solutionDocs)

  return createdDocs.map((doc) => doc._id as Types.ObjectId)
}
