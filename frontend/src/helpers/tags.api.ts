import type { BackendError, IErrors } from '../types/common'
import type {
  ITagsAPIResp,
  ITag,
  IEditTag,
  ITagAPIResp,
  ITagsStrAPIResp,
} from '../types/tags'
import axios from './axios'
import { globalError } from './toast.store'

const ROUTE = '/tags'

export const getTagsAPI = async (): Promise<ITag[]> => {
  try {
    const res = await axios.get<ITagsAPIResp>(ROUTE)
    return res.data.data
  } catch (err) {
    globalError.value = [(err as BackendError).error]
    return []
  }
}

export const createTagsAPI = async (
  tagNames: string[]
): Promise<ITagsAPIResp> => {
  const res = await axios.post<ITagsAPIResp>(
    ROUTE,
    { names: tagNames },
    {
      headers: { 'Content-Type': 'application/json' },
    }
  )

  return res.data
}

export const editTagsAPI = async (
  editTags: IEditTag[]
): Promise<ITagsAPIResp & IErrors> => {
  const editedTags: ITag[] = []
  const errors: string[] = []

  for (const { _id: tagId, name } of editTags) {
    try {
      const res = await axios.patch<ITagAPIResp>(
        `${ROUTE}/${tagId}`,
        { name },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )

      editedTags.push(res.data.data)
    } catch (err) {
      errors.push((err as BackendError).error)
    }
  }

  return { success: true, data: editedTags, errors }
}

export const deleteTagsAPI = async (
  tagIds: string[]
): Promise<ITagsStrAPIResp & IErrors> => {
  const deletedTags: string[] = []
  const errors: string[] = []

  for (const tagId of tagIds) {
    try {
      const res = await axios.delete<ITagsAPIResp>(`${ROUTE}/${tagId}`)

      if (res.data.message) deletedTags.push(res.data.message)
    } catch (err) {
      errors.push((err as BackendError).error)
    }
  }

  return { success: true, data: deletedTags, errors }
}

export const performTagOps = async (
  newTagsToCreate: string[],
  editedTagsToUpdate: IEditTag[],
  tagsToDelete: string[]
) => {
  const toastMessages = []

  try {
    const [createRes, editRes, deleteRes] = await Promise.all([
      newTagsToCreate.length && createTagsAPI(newTagsToCreate),
      editedTagsToUpdate.length && editTagsAPI(editedTagsToUpdate),
      tagsToDelete.length && deleteTagsAPI(tagsToDelete),
    ])

    if (createRes && createRes.message) {
      toastMessages.push(createRes.message)
    }

    if (editRes) {
      toastMessages.push(...editRes.errors)
    }

    if (deleteRes) {
      toastMessages.push(...deleteRes.data)
      toastMessages.push(...deleteRes.errors)
    }

    if (toastMessages.length > 0) globalError.value = toastMessages
  } catch (err) {
    console.error('Error occurred in performTagOps function', err)
  }
}
