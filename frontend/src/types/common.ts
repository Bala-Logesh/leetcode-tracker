export type DateType = {
  createdAt: string
  updatedAt: string
}

export type IErrors = {
  errors: string[]
}

export type BackendError = {
  error: string
  status: number
}

export type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export const DEFAULT_PAGINATION = {
  total: 1,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
}
