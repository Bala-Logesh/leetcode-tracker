import { Types } from 'mongoose'
import Solution from '../models/solutions'

export const createSolution = async (
  problemId: Types.ObjectId,
  solutionStrings: string[]
): Promise<Types.ObjectId> => {
  const solution = {
    problemId,
    solutions: solutionStrings,
  }

  const createdSolution = await Solution.create(solution)

  return createdSolution._id
}

export const createSolutions = async (
  problemId: Types.ObjectId,
  solutionStrings: string[]
): Promise<Types.ObjectId[]> => {
  const solutionDocs = solutionStrings.map((content) => ({
    problemId,
    solutions: content,
  }))

  const createdDocs = await Solution.insertMany(solutionDocs)

  return createdDocs.map((doc) => doc._id as Types.ObjectId)
}
