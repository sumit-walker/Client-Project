import Portfolio from '../models/Portfolio.js'
import cloudinary from 'cloudinary'

export const getAll = async (req, res) => {
  try {
    const { category } = req.query
    const query = category && category !== 'all' ? { category } : {}
    const items = await Portfolio.find(query).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const { title, caption, image, type, category, cloudinaryId, images } = req.body
    const item = await Portfolio.create({ title, caption, image: image || images?.[0]?.url, cloudinaryId: cloudinaryId || images?.[0]?.publicId, images: images || [], type, category })
    res.status(201).json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const { images, ...rest } = req.body
    const updateData = { ...rest }
    if (images) updateData.images = images
    const item = await Portfolio.findByIdAndUpdate(req.params.id, updateData, { new: true })
    res.json(item)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    const item = await Portfolio.findById(req.params.id)
    if (item?.cloudinaryId) {
      await cloudinary.v2.uploader.destroy(item.cloudinaryId)
    }
    if (item?.images?.length) {
      await Promise.all(item.images.map(img => img.publicId && cloudinary.v2.uploader.destroy(img.publicId).catch(() => {})))
    }
    await Portfolio.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const testCreate = async (req, res) => { try { const { title, caption, image, type, category, cloudinaryId, images } = req.body; console.log('images:', JSON.stringify(images)); console.log('image from body:', image); console.log('fallback:', images?.[0]?.url); res.json({ ok: true, images, firstUrl: images?.[0]?.url }) } catch(e) { res.status(500).json({ e: e.message }) } }
