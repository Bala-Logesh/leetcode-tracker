import axios from './axios'

import type {
  ICreateProblem,
  IProblem,
  IProblemAPIResp,
  IProblemRespCommon,
  IProblemReturn,
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
): Promise<IProblem | null> => {
  try {
    const res = await axios.get<IProblemAPIResp>(`${ROUTE}/${problemId}`)
    return res.data.data
  } catch (err) {
    globalError.value = [(err as BackendError).error]
    return null
  }
}

export const createProblemAPI = async (
  newProblem: ICreateProblem
): Promise<IProblemReturn> => {
  try {
    const res = await axios.post<IProblemAPIResp>(
      ROUTE,
      { ...newProblem },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return { success: true, data: res.data.data }
  } catch (err) {
    return { success: false, error: (err as BackendError).error }
  }
}

export const editProblemAPI = async (
  problemId: string,
  updatedProblem: ICreateProblem
): Promise<IProblemReturn> => {
  try {
    const res = await axios.put<IProblemAPIResp>(
      `${ROUTE}/${problemId}`,
      { ...updatedProblem },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return { success: true, data: res.data.data }
  } catch (err) {
    return { success: false, error: (err as BackendError).error }
  }
}

export const toggleDateAPI = async (
  problemId: string,
  newDate: string,
  isAdding: boolean
): Promise<boolean> => {
  try {
    await axios.patch<IProblemAPIResp>(
      `${ROUTE}/${problemId}/attempts`,
      { dateString: newDate, action: isAdding ? 'add' : 'remove' },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return true
  } catch (err) {
    globalError.value = [(err as BackendError).error]
    return false
  }
}

export const deleteProblemAPI = async (problemId: string): Promise<boolean> => {
  try {
    await axios.delete<IProblemRespCommon>(`${ROUTE}/${problemId}`)
    return true
  } catch (err) {
    globalError.value = [(err as BackendError).error]
    return false
  }
}
