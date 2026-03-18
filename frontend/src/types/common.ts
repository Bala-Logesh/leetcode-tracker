export type DateType = {
  createdAt: string
  updatedAt: string
}

export type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
