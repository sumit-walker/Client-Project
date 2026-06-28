import Service from '../models/Service.js'

export const getAll = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 })
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getAllAdmin = async (req, res) => {
  try {
    const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 })
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const service = await Service.create(req.body)
    res.status(201).json(service)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(service)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const reorderAll = async (req, res) => {
  try {
    const { items } = req.body
    const bulk = items.map((item, i) => ({
      updateOne: { filter: { _id: item._id }, update: { sortOrder: i + 1 } },
    }))
    await Service.bulkWrite(bulk)
    const services = await Service.find().sort({ sortOrder: 1, createdAt: -1 })
    res.json(services)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (service?.images?.length) {
      const cloudIds = service.images.filter(i => i.publicId).map(i => i.publicId)
      if (cloudIds.length > 0) {
        const cloudinary = (await import('cloudinary')).v2
        await Promise.all(cloudIds.map(id => cloudinary.uploader.destroy(id)))
      }
    }
    await Service.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
