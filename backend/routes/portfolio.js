import { Router } from 'express'
import { getAll, create, update, remove } from '../controllers/portfolio.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/', getAll)
router.post('/', protect, adminOnly, create)
router.put('/:id', protect, adminOnly, update)
router.delete('/:id', protect, adminOnly, remove)

export default router
