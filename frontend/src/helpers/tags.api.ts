import type { ITagsAPIResp, ITag, IEditTag, ITagAPIResp } from '../types/tags'
import axios from './axios'
import { handleApiError } from './errors'

const ROUTE = '/tags'

export const getTagsAPI = async (): Promise<ITag[]> => {
  try {
    const res = await axios.get<ITagsAPIResp>(ROUTE)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const createTagsAPI = async (tagNames: string[]): Promise<ITag[]> => {
  try {
    const res = await axios.post<ITagsAPIResp>(
      ROUTE,
      { names: tagNames },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const editTagsAPI = async (editTags: IEditTag[]): Promise<ITag[]> => {
  const editedTags = []

  for (const { _id: tagId, name } of editTags) {
    try {
      const res = await axios.patch<ITagAPIResp>(
        `${ROUTE}/${tagId}`,
        { name },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      editedTags.push(res.data.data)
    } catch (err) {
      throw handleApiError(err)
    }
  }

  return editedTags
}

export const deleteTagsAPI = async (tagIds: string[]): Promise<void> => {
  for (const tagId of tagIds) {
    try {
      const res = await axios.delete<ITagsAPIResp>(`${ROUTE}/${tagId}`)
      console.log(res.data.message)
    } catch (err) {
      throw handleApiError(err)
    }
  }
}
