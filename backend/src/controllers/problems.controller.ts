import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import logger from '../logger/logger'
import Problem from '../models/problem'
import Solution from '../models/solutions'
import { getOrCreateTags } from '../helpers/tags.helper'
import {
  createSolution,
  createSolutions,
  deleteAndUpdateSolution,
  deleteAndUpdateSolutions,
} from '../helpers/solutions.helper'

// GET /problems
export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const skip = (page - 1) * limit

    const [problems, total] = await Promise.all([
      Problem.find()
        .sort({ problemNo: 1 })
        .skip(skip)
        .limit(limit)
        .populate('tags')
        .populate('solutions')
        .populate('dpPoints')
        .populate('pointsToRemember')
        .lean(),
      Problem.countDocuments(),
    ])

    const totalPages = Math.ceil(total / limit)

    logger.info(
      `GET /problems - page ${page}, limit ${limit} - returned ${problems.length} tags`
    )

    res.status(200).json({
      success: true,
      data: problems,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (err) {
    logger.error(`GET /problems - error getting problems`, err as Error)
    next(new APIError('Failed to get problems', 500))
  }
}

// GET /problems/:problemId
export const getProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  try {
    const problem = await Problem.findById(problemId)
      .populate('tags')
      .populate('solutions')
      .populate('dpPoints')
      .populate('pointsToRemember')
      .lean()

    if (!problem) {
      return next(new APIError(`Problem with id ${problemId} not found`, 404))
    }

    logger.info(`GET /problems/${problemId} - Success`)

    res.status(200).json({ success: true, data: problem })
  } catch (err) {
    logger.error(`GET /problems/${problemId} - Error`, err as Error)

    if ((err as any).name === 'CastError') {
      return next(new APIError('Invalid Problem ID format', 400))
    }

    next(new APIError('Failed to retrieve problem', 500))
  }
}

// POST /problems
export const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      problemNo,
      name,
      tags,
      solutions,
      pointsToRemember,
      dpPoints,
      datesAttempted,
    } = req.body

    const newProblem = await Problem.create({
      problemNo,
      name,
      tags,
      datesAttempted,
    })

    const solutionIds = await createSolutions(newProblem._id, solutions)
    newProblem.solutions = solutionIds

    if (pointsToRemember) {
      const pointsToRemId = await createSolution(
        newProblem._id,
        pointsToRemember
      )
      newProblem.pointsToRemember = pointsToRemId
    }

    if (dpPoints) {
      const dpPointsId = await createSolution(newProblem._id, dpPoints)
      newProblem.dpPoints = dpPointsId
    }

    await newProblem.save()

    logger.info(
      `POST /problems - created a problem with problem number = ${problemNo} and id = ${newProblem._id}`
    )

    res.status(201).json({
      success: true,
      data: newProblem,
    })
  } catch (err) {
    logger.error(`POST /problems - error creating problems`, err as Error)
    next(new APIError('Failed to create problems', 500))
  }
}

// PUT /problems/:problemId
export const updateProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  try {
    const updateData = req.body
    let solDeleted = false

    const problem = await Problem.findById(problemId)
    if (!problem) {
      logger.error(
        `PUT /problems/${problemId} - Problem with id ${problemId} not found`
      )
      return next(new APIError(`Problem with id ${problemId} not found`, 404))
    }

    if (updateData.tags) {
      updateData.tags = await getOrCreateTags(updateData.tags)
    }

    if (updateData.solutions) {
      solDeleted = true
      updateData.solutions = await deleteAndUpdateSolutions(
        problem._id,
        updateData.solutions
      )
    }

    if (updateData.pointsToRemember) {
      const pointsToRemId = await deleteAndUpdateSolution(
        problem._id,
        updateData.pointsToRemember,
        solDeleted
      )
      updateData.pointsToRemember = pointsToRemId
    }

    if (updateData.dpPoints) {
      const dpPointsId = await deleteAndUpdateSolution(
        problem._id,
        updateData.dpPoints,
        solDeleted
      )
      updateData.dpPoints = dpPointsId
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      problem._id,
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    )
      .populate('tags')
      .populate('solutions')
      .populate('dpPoints')
      .populate('pointsToRemember')
      .lean()

    logger.info(
      `PUT /problems/${problemId} - updated problem with id ${problemId} successfully`
    )

    res.status(200).json({
      success: true,
      data: updatedProblem,
    })
  } catch (err) {
    logger.error(
      `PUT /problems/${problemId} - error updating problem`,
      err as Error
    )
    next(new APIError('Failed to update problem', 500))
  }
}

// DELETE /problems/problemId
export const deleteProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  try {
    const problem = await Problem.findById(problemId)

    if (!problem) {
      logger.error(
        `DELETE /problems/${problemId} - Problem with id ${problemId} not found`
      )
      return next(new APIError(`Problem with id ${problemId} not found`, 404))
    }

    const solutionIdsToDelete = [
      ...(problem.solutions || []),
      problem.pointsToRemember,
      problem.dpPoints,
    ].filter(Boolean)

    if (solutionIdsToDelete.length > 0) {
      await Solution.deleteMany({ _id: { $in: solutionIdsToDelete } })
    }

    await problem.deleteOne()

    logger.info(`DELETE /problems/${problemId} - Success`)

    res.status(200).json({
      success: true,
      message: 'Problem and associated solutions deleted successfully',
    })
  } catch (err) {
    logger.error(`DELETE /problems/${problemId} - Error`, err as Error)

    if ((err as any).name === 'CastError') {
      return next(new APIError('Invalid Problem ID format', 400))
    }

    next(new APIError('Failed to delete problem', 500))
  }
}
