import { Router } from 'express'
import { deleteTag, getTags, updateTag } from '../controllers/tags.controller'

const router = Router()
router.get('/', getTags)
router.patch('/:tagId', updateTag)
router.delete('/:tagId', deleteTag)

export default router
