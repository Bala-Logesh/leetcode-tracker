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
  solutionStrings: string[][]
): Promise<Types.ObjectId[]> => {
  const solutionDocs = solutionStrings.map((content) => ({
    problemId,
    solutions: content,
  }))

  const createdDocs = await Solution.insertMany(solutionDocs)

  return createdDocs.map((doc) => doc._id as Types.ObjectId)
}

export const deleteAndUpdateSolutions = async (
  problemId: Types.ObjectId,
  solutionStrings: string[][]
): Promise<Types.ObjectId[]> => {
  await Solution.deleteMany({ problemId })

  let solutionsWithRef = solutionStrings.map((sol) => ({
    problemId,
    solutions: sol,
  }))

  const createdSolutions = await Solution.insertMany(solutionsWithRef)

  return createdSolutions.map((sol) => sol._id as Types.ObjectId)
}

export const deleteAndUpdateSolution = async (
  problemId: Types.ObjectId,
  solutionStrings: string[],
  solDeleted: boolean
): Promise<Types.ObjectId> => {
  if (!solDeleted) await Solution.deleteMany({ problemId })

  let solutionWithRef = {
    problemId,
    solutions: solutionStrings,
  }

  const createdSolution = await Solution.create(solutionWithRef)

  return createdSolution._id
}
