import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import Tag from '../models/tag'
import logger from '../logger/logger'
import Problem from '../models/problem'

// GET /tags
export const getTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tags = await Tag.find().sort({ name: 1 }).lean()

    logger.info(`GET /tags - returned ${tags.length} tags`)

    res.status(200).json({ success: true, data: tags })
  } catch (err) {
    logger.error(`GET /tags - error getting tags`, err as Error)
    next(new APIError('Failed to get tags', 500))
  }
}

// PATCH /tags/:tagId
export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tagId } = req.params

  try {
    const { name } = req.body

    if (!name) {
      logger.error(`PATCH /tags/${tagId} - Tag name is required for update`)
      return next(new APIError('Tag name is required for update', 400))
    }

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: tagId },
      { name: name.trim() },
      { new: true, runValidators: true }
    ).lean()

    if (!updatedTag) {
      logger.error(`PATCH /tags/${tagId} - Tag with id ${tagId} not found`)
      return next(new APIError(`Tag with id ${tagId} not found`, 404))
    }

    logger.info(`PATCH /tags/${tagId} - Tag renamed to "${name}"`)

    res.status(200).json({ success: true, data: updatedTag })
  } catch (err) {
    if ((err as any).code === 11000) {
      return next(new APIError('A tag with this name already exists', 400))
    }

    logger.error(`PATCH /tags/${tagId} - error updating tag`, err as Error)
    next(new APIError('Failed to update tag', 500))
  }
}

// DELETE /tags/:tagId
export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tagId } = req.params

  try {
    const tagToDelete = await Tag.findById(tagId)

    if (!tagToDelete) {
      logger.error(`DELETE /tags/${tagId} - Tag with id ${tagId} not found`)
      return next(new APIError(`Tag with id ${tagId} not found`, 404))
    }

    const updateResult = await Problem.updateMany(
      { tags: tagId },
      { $pull: { tags: tagId } }
    )

    await tagToDelete.deleteOne()

    logger.info(
      `DELETE /tags/${tagId} - Tag "${tagToDelete.name}" deleted. Removed from ${updateResult.modifiedCount} problems.`
    )

    res.status(200).json({
      success: true,
      message: `Tag deleted and removed from ${updateResult.modifiedCount} problems`,
    })
  } catch (err) {
    logger.error(`DELETE /tags/${tagId} - error deleting tag`, err as Error)
    next(new APIError('Failed to delete tag', 500))
  }
}
