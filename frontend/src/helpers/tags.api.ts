import type { ICreateTagsAPIResp, IGetTagsAPIResp, ITag } from '../types/tags'
import axios from './axios'
import { handleApiError } from './errors'

const ROUTE = '/tags'

export const getTagsAPI = async (): Promise<ITag[]> => {
  try {
    const res = await axios.get<IGetTagsAPIResp>(ROUTE)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const createTagsAPI = async (tagNames: string[]): Promise<ITag[]> => {
  try {
    const res = await axios.post<ICreateTagsAPIResp>(
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