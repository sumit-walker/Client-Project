import { Router } from 'express'
import { getAll, getStats, create, update, remove } from '../controllers/reviews.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/stats', protect, adminOnly, getStats)
router.get('/', getAll)
router.post('/', create)
router.put('/:id', protect, adminOnly, update)
router.delete('/:id', protect, adminOnly, remove)

export default router
