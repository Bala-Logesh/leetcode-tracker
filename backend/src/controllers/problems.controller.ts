import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import logger from '../logger/logger'
import Problem from '../models/problem'
import Solution from '../models/solutions'
import { createSolution, createSolutions } from '../helpers/solutions.helper'
import { checkDate } from '../helpers/utils'
import { IProblemDateUpd, IProblemReq } from '../types/problem.types'
import { checkDuplicateError } from '../helpers/problem.helper'

// GET /problems
export const getProblems = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const LOG_PREFIX = 'GET /problems -'

  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const tags = (req.query.tags as string) || ''
    const search = (req.query.search as string) || ''
    const tagIds = tags ? tags.split(',') : []

    const skip = (page - 1) * limit

    const query: any = {}
    if (tagIds.length > 0) {
      query.tags = { $in: tagIds }
    }

    if (search) {
      const searchAsNum = parseInt(search)
      const isNumeric = !isNaN(searchAsNum) && /^\d+$/.test(search)

      query.$or = [{ name: { $regex: search, $options: 'i' } }]

      if (isNumeric) {
        query.$or.push({ problemNo: searchAsNum })
      }
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
      `${LOG_PREFIX} page [${page}], limit [${limit}], tags [${tags}], search [${search}] - returned ${problems.length} problems`
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
    next(err)
  }
}

// GET /problems/:problemId
export const getProblemById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  const LOG_PREFIX = `GET /problems/${problemId} -`

  try {
    const problem = await Problem.findById(problemId)
      .populate('tags')
      .populate('solutions')
      .populate('dpPoints')
      .populate('pointsToRemember')
      .lean()

    if (!problem) {
      throw new APIError(`Problem with id "${problemId}" not found`, 404)
    }

    logger.info(`${LOG_PREFIX} Problem with id "${problemId}" found`)
    res.status(200).json({ success: true, data: problem })
  } catch (err) {
    if ((err as any).name === 'CastError') {
      next(new APIError('Invalid Problem ID format', 400))
      return
    }

    if (err instanceof APIError) {
      next(err)
      return
    }

    next(new APIError('Failed to get problems', 500))
  }
}

// POST /problems
export const createProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const LOG_PREFIX = 'POST /problems -'

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
      `${LOG_PREFIX} created a problem with problem number "${problemNo}" and id = "${newProblem._id}"`
    )

    res.status(201).json({
      success: true,
      data: newProblem,
    })
  } catch (err: any) {
    const errMsg = checkDuplicateError(err)
    if (errMsg) {
      next(new APIError(errMsg, 400))
      return
    }

    if (err instanceof APIError) {
      next(err)
      return
    }

    next(new APIError('Failed to create problem', 500))
  }
}

// PUT /problems/:problemId
export const updateProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  const LOG_PREFIX = `PUT /problems${problemId} -`

  try {
    const updateData: IProblemReq = req.body

    const problem = await Problem.findById(problemId)
    if (!problem) {
      throw new APIError(`Problem with id "${problemId}" not found`, 404)
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
        throw new APIError(
          'Date format is wrong. Expected: mm/dd/yyyy hh:mm:ss',
          400
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
      `${LOG_PREFIX} updated problem with id "${problemId}" successfully`
    )

    res.status(200).json({
      success: true,
      data: updatedProblem,
    })
  } catch (err) {
    if ((err as any).name === 'CastError') {
      next(new APIError('Invalid Problem ID format', 400))
      return
    }

    const errMsg = checkDuplicateError(err)
    console.log('errMsg', errMsg)
    if (errMsg) {
      next(new APIError(errMsg, 400))
      return
    }

    if (err instanceof APIError) {
      next(err)
      return
    }

    next(new APIError(`Failed to update problem with id "${problemId}"`, 500))
  }
}

// PATCH /problems/:problemId/attempts
export const addAttemptDates = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  const LOG_PREFIX = `PATCH /problems/${problemId}/attempts -`

  const { dateString, action }: IProblemDateUpd = req.body

  try {
    if (!dateString || !['add', 'remove'].includes(action)) {
      throw new APIError('Invalid date or action provided', 400)
    }

    let updateQuery = {}

    if (action === 'add') {
      if (!checkDate(dateString)) {
        throw new APIError(
          'Full timestamp required for adding: mm/dd/yyyy hh:mm:ss',
          400
        )
      }

      updateQuery = { $addToSet: { datesAttempted: dateString } }
    } else {
      const datePart = dateString.split(' ')[0]

      updateQuery = {
        $pull: {
          datesAttempted: { $regex: `^${datePart}` },
        },
      }
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      problemId,
      updateQuery,
      { returnDocument: 'after' }
    )
      .select('datesAttempted')
      .lean()

    if (!updatedProblem) {
      return next(new APIError(`Problem with id "${problemId}" not found`, 404))
    }

    logger.info(
      `${LOG_PREFIX} ${action === 'add' ? 'added' : 'removed'} date "${dateString}" ${action === 'add' ? 'to' : 'from'} problem with id "${problemId}" successfully`
    )

    res.status(200).json({
      success: true,
      data: updatedProblem,
    })
  } catch (err) {
    if ((err as any).name === 'CastError') {
      next(new APIError('Invalid Problem ID format', 400))
      return
    }

    next(
      new APIError(
        `Failed to update attempt dates for problem with id "${problemId}`,
        500
      )
    )
  }
}

// DELETE /problems/problemId
export const deleteProblem = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { problemId } = req.params
  const LOG_PREFIX = `DELETE /problems/${problemId} -`

  try {
    const problem = await Problem.findById(problemId)

    if (!problem) {
      throw new APIError(`Problem with id "${problemId}" not found`, 404)
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

    logger.info(
      `${LOG_PREFIX} - Problem with id "${problemId}" deleted successfully`
    )

    res.status(200).json({
      success: true,
      message: `Problem with id "${problemId}" and associated solutions deleted successfully`,
    })
  } catch (err) {
    if ((err as any).name === 'CastError') {
      return next(new APIError('Invalid Problem ID format', 400))
    }

    next(new APIError(`Failed to delete problem with id "${problemId}"`, 500))
  }
}
