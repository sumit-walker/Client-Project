import { Router } from 'express'
import { uploadImage, uploadMultiple, uploadPublic } from '../controllers/upload.js'
import { upload } from '../config/cloudinary.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()
router.post('/image', protect, adminOnly, upload.single('image'), uploadImage)
router.post('/multiple', protect, adminOnly, upload.array('images', 10), uploadMultiple)
router.post('/public', upload.single('image'), uploadPublic)

export default router
