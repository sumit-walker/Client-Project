import { Router } from 'express'
import { getAll, getAllAdmin, create, update, remove, reorderAll } from '../controllers/services.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/', getAll)
router.get('/all', protect, adminOnly, getAllAdmin)
router.post('/', protect, adminOnly, create)
router.put('/:id', protect, adminOnly, update)
router.put('/reorder', protect, adminOnly, reorderAll)
router.delete('/:id', protect, adminOnly, remove)

export default router
