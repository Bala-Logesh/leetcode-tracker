import type { DateType } from './common'

export type IDisplayTag = {
  _id?: string
  name: string
  isNew?: boolean
  isDeleted?: boolean
}

export type ITag = {
  _id: string
  name: string
  count: number
  slug: string
  __v?: number
} & DateType

export type ICreateTag = Pick<ITag, 'name'>

export type IEditTag = Pick<IDisplayTag, '_id' | 'name'>

// API Types
export type ITagsAPIResp = {
  success: boolean
  data: ITag[]
  message?: string
}

export type ITagAPIResp = {
  success: boolean
  data: ITag
  message?: string
}
