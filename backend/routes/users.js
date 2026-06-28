import { Router } from 'express'
import { getAll, toggleBlock, remove, getBookings, saveLook } from '../controllers/users.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/', protect, adminOnly, getAll)
router.patch('/:id/block', protect, adminOnly, toggleBlock)
router.delete('/:id', protect, adminOnly, remove)
router.get('/:id/bookings', protect, adminOnly, getBookings)
router.post('/save-look', protect, saveLook)

export default router
