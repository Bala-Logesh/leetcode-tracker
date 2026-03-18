import axios from './axios'
import { handleApiError } from './errors'
import type { IProblem, IProblemsAPIResp } from '../types/problem'

const ROUTE = '/problems'

export const getProblemsAPI = async (): Promise<IProblem[]> => {
  try {
    const res = await axios.get<IProblemsAPIResp>(ROUTE)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}
