import { Types } from 'mongoose'
import Tag from '../models/tag'

export const getOrCreateTags = async (
  tagNames: string[]
): Promise<Types.ObjectId[]> => {
  const tagIds = await Promise.all(
    tagNames.map(async (name) => {
      const tag = await Tag.findOneAndUpdate(
        { name: name.trim() },
        { $setOnInsert: { name: name.trim() } },
        { upsert: true, returnDocument: 'after', runValidators: true }
      )

      return tag._id as Types.ObjectId
    })
  )

  return tagIds
}
