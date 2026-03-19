import axios, { AxiosError } from 'axios'
import type { BackendError } from '../types/common'

const instance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 1000,
})

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendError>) => {
    const status = error.response?.status
    const errorMessage =
      error.response?.data?.error || 'An unexpected error occurred'

    const method = error.config?.method?.toUpperCase() || 'UNKNOWN'
    const url = error.config?.url || 'UNKNOWN URL'

    const logString = `${method} ${url} [${status}] - ${errorMessage}`

    console.error(logString)
    
    return Promise.reject({
      error: errorMessage,
      status: status || 500,
    })
  }
)

export default instance
