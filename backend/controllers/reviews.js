import Review from '../models/Review.js'

export const getAll = async (req, res) => {
  try {
    const query = req.query.admin ? {} : { isApproved: true }
    const reviews = await Review.find(query).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getStats = async (req, res) => {
  try {
    const total = await Review.countDocuments()
    const approved = await Review.countDocuments({ isApproved: true })
    const pending = await Review.countDocuments({ isApproved: false })
    const avg = await Review.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }])
    res.json({ total, approved, pending, avgRating: avg[0]?.avg || 0 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.user) data.user = req.user._id
    const review = await Review.create(data)
    res.status(201).json(review)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(review)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
