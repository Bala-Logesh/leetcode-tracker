import { Router } from 'express'
import {
  createTags,
  deleteTag,
  getTags,
  updateTag,
} from '../controllers/tags.controller'

const router = Router()
router.get('/', getTags)
router.post('/', createTags)
router.patch('/:tagId', updateTag)
router.delete('/:tagId', deleteTag)

export default router
