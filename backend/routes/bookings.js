import { Router } from 'express'
import { getAll, getMy, getToday, getStats, create, update, remove } from '../controllers/bookings.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/stats', protect, adminOnly, getStats)
router.get('/today', protect, adminOnly, getToday)
router.get('/my', protect, getMy)
router.get('/', protect, adminOnly, getAll)
router.post('/', create)
router.put('/:id', protect, adminOnly, update)
router.delete('/:id', protect, adminOnly, remove)

export default router
