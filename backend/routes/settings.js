import { Router } from 'express'
import { getAll, update } from '../controllers/settings.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.get('/', getAll)
router.put('/', protect, adminOnly, update)

export default router
