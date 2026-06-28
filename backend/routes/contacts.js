import { Router } from 'express'
import { getAll, create, markReplied, remove } from '../controllers/contacts.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/', protect, adminOnly, getAll)
router.post('/', create)
router.patch('/:id/reply', protect, adminOnly, markReplied)
router.delete('/:id', protect, adminOnly, remove)

export default router
