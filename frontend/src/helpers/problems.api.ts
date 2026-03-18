import axios from './axios'
import { handleApiError } from './errors'
import type {
  ICreateProblem,
  IProblem,
  IProblemAPIResp,
  IProblemsAPIResp,
} from '../types/problem'

const ROUTE = '/problems'

export const getProblemsAPI = async (): Promise<IProblem[]> => {
  try {
    const res = await axios.get<IProblemsAPIResp>(ROUTE)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const getProblemAPIById = async (
  problemId: string
): Promise<IProblem> => {
  try {
    const res = await axios.get<IProblemAPIResp>(`${ROUTE}/${problemId}`)
    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const createProblemAPI = async (
  newProblem: ICreateProblem
): Promise<IProblem> => {
  try {
    const res = await axios.post<IProblemAPIResp>(
      ROUTE,
      { ...newProblem },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}

export const editProblemAPI = async (
  problemId: string,
  updatedProblem: ICreateProblem
): Promise<IProblem> => {
  try {
    const res = await axios.put<IProblemAPIResp>(
      `${ROUTE}/${problemId}`,
      { ...updatedProblem },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return res.data.data
  } catch (err) {
    throw handleApiError(err)
  }
}
