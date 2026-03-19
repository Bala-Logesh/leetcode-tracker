import axios from './axios'
import { handleApiError } from './errors'
import type {
  ICreateProblem,
  IProblem,
  IProblemAPIResp,
  IProblemRespCommon,
  IProblemsAPIResp,
} from '../types/problem'
import { globalError } from './toast.store'
import type { BackendError } from '../types/common'

const ROUTE = '/problems'

export const getProblemsAPI = async (
  searchText?: string,
  searchTag?: string,
  page: number = 1,
  limit: number = 10
): Promise<IProblemsAPIResp | null> => {
  try {
    const params = {
      search: searchText?.trim() || undefined,
      tags: searchTag === 'all' ? undefined : searchTag,
      page,
      limit,
    }

    const res = await axios.get<IProblemsAPIResp>(ROUTE, {
      params,
    })
    return res.data
  } catch (err) {
    globalError.value = [(err as BackendError).error]
    return null
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

export const toggleDateAPI = async (
  problemId: string,
  newDate: string,
  isAdding: boolean
): Promise<void> => {
  try {
    const res = await axios.patch<IProblemAPIResp>(
      `${ROUTE}/${problemId}/attempts`,
      { dateString: newDate, action: isAdding ? 'add' : 'remove' },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    console.log(res.data.data)
  } catch (err) {
    throw handleApiError(err)
  }
}

export const deleteProblemAPI = async (problemId: string): Promise<void> => {
  try {
    const res = await axios.delete<IProblemRespCommon>(`${ROUTE}/${problemId}`)
    console.log(res.data.message)
  } catch (err) {
    throw handleApiError(err)
  }
}
