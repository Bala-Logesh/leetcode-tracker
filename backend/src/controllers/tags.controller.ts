import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import Tag from '../models/tag'
import logger from '../logger/logger'

// GET /tags
export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean()

    logger.info(`GET /tags - returned ${tags.length} tags`)

    res.status(200).json({
      data: tags,
    })
  } catch (err) {
    logger.error(`GET /tags - error getting tags`, err as Error)
    next(new APIError('Failed to get tags', 500))
  }
}
