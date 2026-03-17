import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import logger from '../logger/logger'
import Problem from '../models/problem'
import { createSolution, createSolutions } from '../helpers/solutions.helper'

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
