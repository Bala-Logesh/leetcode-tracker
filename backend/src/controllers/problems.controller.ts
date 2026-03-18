import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import logger from '../logger/logger'
import Problem from '../models/problem'
import Solution from '../models/solutions'
import { createSolution, createSolutions } from '../helpers/solutions.helper'
import { checkDate } from '../helpers/utils'
import { IProblemReq } from '../types/problem.types'

// GET /problems
export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const tags = (req.query.tags as string) || ''
    const tagIds = tags ? tags.split(',') : []

    const skip = (page - 1) * limit

    const query: any = {}
    if (tagIds.length > 0) {
      query.tags = { $in: tagIds }
    }

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .sort({ problemNo: 1 })
        .skip(skip)
        .limit(limit)
        .populate('tags')
        .populate('solutions')
        .populate('dpPoints')
        .populate('pointsToRemember')
        .lean(),
      Problem.countDocuments(query),
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
      logger.error(
        `GET /problems/${problemId} - Problem with id ${problemId} not found`
      )
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
    }: IProblemReq = req.body

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

    await newProblem.populate([
      { path: 'tags' },
      { path: 'solutions' },
      { path: 'dpPoints' },
      { path: 'pointsToRemember' },
    ])

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
    const updateData: IProblemReq = req.body

    const problem = await Problem.findById(problemId)
    if (!problem) {
      logger.error(
        `PUT /problems/${problemId} - Problem with id ${problemId} not found`
      )
      return next(new APIError(`Problem with id ${problemId} not found`, 404))
    }

    const updateQuery: any = { $set: {}, $unset: {} }

    if (updateData.solutions) {
      await Solution.deleteMany({ _id: { $in: problem.solutions } })
      updateQuery.$set.solutions = await createSolutions(
        problem._id,
        updateData.solutions
      )
    }

    if (updateData.pointsToRemember) {
      if (problem.pointsToRemember)
        await Solution.findByIdAndDelete(problem.pointsToRemember)
      updateQuery.$set.pointsToRemember = await createSolution(
        problem._id,
        updateData.pointsToRemember
      )
    } else if (problem.pointsToRemember) {
      await Solution.findByIdAndDelete(problem.pointsToRemember)
      updateQuery.$unset.pointsToRemember = ''
    }

    if (updateData.dpPoints) {
      if (problem.dpPoints) await Solution.findByIdAndDelete(problem.dpPoints)
      updateQuery.$set.dpPoints = await createSolution(
        problem._id,
        updateData.dpPoints
      )
    } else if (problem.dpPoints) {
      await Solution.findByIdAndDelete(problem.dpPoints)
      updateQuery.$unset.dpPoints = ''
    }

    if (updateData.datesAttempted && updateData.datesAttempted.length > 0) {
      const allDatesValid = updateData.datesAttempted.every((dateStr) =>
        checkDate(dateStr)
      )

      if (!allDatesValid) {
        logger.error(
          `PUT /problems/${problemId} - One or more dates have an invalid format`
        )
        return next(
          new APIError(
            'Date format is wrong. Expected: mm/dd/yyyy hh:mm:ss',
            400
          )
        )
      }

      updateQuery.$addToSet = {
        datesAttempted: { $each: updateData.datesAttempted },
      }
    }

    const { solutions, pointsToRemember, dpPoints, datesAttempted, ...rest } =
      updateData
    Object.assign(updateQuery.$set, rest)

    const updatedProblem = await Problem.findByIdAndUpdate(
      problem._id,
      updateQuery,
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
