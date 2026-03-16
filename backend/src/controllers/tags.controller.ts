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
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10

    const skip = (page - 1) * limit

    const [tags, total] = await Promise.all([
      Tag.find().sort({ name: 1 }).skip(skip).limit(limit),
      Tag.countDocuments(),
    ])

    const totalPages = Math.ceil(total / limit)

    logger.info(
      `GET /tags - page ${page}, limit ${limit} - returned ${tags.length} tags`
    )

    res.status(200).json({
      data: tags,
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
    logger.error(`GET /tags - error getting tags`, err as Error)
    next(new APIError('Failed to get tags', 500))
  }
}
