import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import logger from '../logger/logger'

// GET /tags
export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    logger.info(`GET /tags - returned ${0} tags`)
    res.status(200).json([])
  } catch (err) {
    logger.error(`GET /tags - error getting tags`, err as Error)
    next(new APIError('Failed to get tags', 500))
  }
}
