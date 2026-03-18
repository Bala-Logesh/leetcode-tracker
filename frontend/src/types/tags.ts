import type { DateType } from './common'

export type ITag = {
  _id: string
  name: string
  count: number
  slug: string
  __v: number
} & DateType

export type IModifyTag = Partial<ITag> &
  Pick<ITag, 'name'> & {
    isNew?: boolean
    isDeleted?: boolean
  }

export type ICreateTag = Pick<ITag, 'name'>

export type IEditTag = Pick<IModifyTag, '_id' | 'name'>

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
