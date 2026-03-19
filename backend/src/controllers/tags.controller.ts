import { Request, Response, NextFunction } from 'express'
import { APIError } from '../middlewares/errorHandler'
import Tag from '../models/tag'
import logger from '../logger/logger'
import Problem from '../models/problem'

// GET /tags
export const getTags = async (req: Request, res: Response): Promise<void> => {
  const LOG_PREFIX = 'GET /tags -'

  const tags = await Tag.find().sort({ name: 1 }).lean()

  logger.info(`${LOG_PREFIX} returned ${tags.length} tags`)

  res.status(200).json({ success: true, data: tags })
}

// POST /tags
export const createTags = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const LOG_PREFIX = 'POST /tags -'

  try {
    const { names } = req.body

    if (!Array.isArray(names) || names.length === 0) {
      throw new APIError('Tag names are missing in request body', 400)
    }

    const cleanTagNames = [
      ...new Set(names.map((n) => n.trim()).filter((n) => n !== '')),
    ]

    const newTags = await Tag.insertMany(
      cleanTagNames.map((name) => ({ name })),
      { ordered: false }
    )

    logger.info(`${LOG_PREFIX} Successfully created [${newTags.length}] tags`)
    res.status(201).json({ success: true, data: newTags })
  } catch (err: any) {
    if (err.name === 'BulkWriteError' || err.code === 11000) {
      const insertedTags = err.insertedDocs || []
      const insertedCount = insertedTags.length || 0

      logger.warn(
        `${LOG_PREFIX} Some tags skipped due to duplicates. Inserted: [${insertedCount}]`
      )

      res.status(201).json({
        success: true,
        data: insertedTags,
        message: `[${insertedCount}] Tags created. Existing tags were skipped.`,
      })

      return
    }

    next(err)
  }
}

// PATCH /tags/:tagId
export const updateTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tagId } = req.params
  const LOG_PREFIX = `PATCH /tags/${tagId} -`
  const { name } = req.body

  try {
    if (!name) {
      throw new APIError('Tag name is required for update', 400)
    }

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: tagId },
      { name: name.trim() },
      { returnDocument: 'after', runValidators: true }
    ).lean()

    if (!updatedTag) {
      throw new APIError(`Tag with id ${tagId} not found`, 404)
    }

    logger.info(`${LOG_PREFIX} Tag renamed to "${name}"`)

    res.status(200).json({ success: true, data: updatedTag })
  } catch (err) {
    if ((err as any).code === 11000) {
      next(new APIError(`A tag with name "${name} already exists`, 400))
      return
    }

    next(err)
  }
}

// DELETE /tags/:tagId
export const deleteTag = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { tagId } = req.params
  const LOG_PREFIX = `DELETE /tags/${tagId} -`

  const tagToDelete = await Tag.findById(tagId)

  if (!tagToDelete) {
    throw new APIError(`Tag with id "${tagId}" not found`, 404)
  }

  const updateResult = await Problem.updateMany(
    { tags: tagId },
    { $pull: { tags: tagId } }
  )

  await tagToDelete.deleteOne()

  logger.info(
    `${LOG_PREFIX} Tag "${tagToDelete.name}" deleted. Removed from ${updateResult.modifiedCount} problems.`
  )

  res.status(200).json({
    success: true,
    message: `Tag "${tagToDelete.name}" deleted and removed from ${updateResult.modifiedCount} problems`,
  })
}
