import type { IGetTagAPI, ITag } from '../types/tags'
import axios from './axios'
import { handleApiError } from './errors'

const ROUTE = '/tags'

export const getTagsAPI = async (): Promise<ITag[]> => {
  try {
    const res = await axios.get<IGetTagAPI>(ROUTE)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}
