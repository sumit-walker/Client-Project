import Booking from '../models/Booking.js'

export const getAll = async (req, res) => {
  try {
    const { status, search, startDate, endDate } = req.query
    const query = {}
    if (status && status !== 'all') query.status = status
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }]
    if (startDate && endDate) query.eventDate = { $gte: startDate, $lte: endDate }
    const bookings = await Booking.find(query).populate('user', 'name email').sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMy = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getToday = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const bookings = await Booking.find({ eventDate: today }).populate('user', 'name email')
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments()
    const today = new Date().toISOString().split('T')[0]
    const todayCount = await Booking.countDocuments({ eventDate: today })
    const approved = await Booking.countDocuments({ status: 'approved' })
    const pending = await Booking.countDocuments({ status: 'pending' })
    const completed = await Booking.countDocuments({ status: 'completed' })
    const revenue = await Booking.aggregate([{ $match: { status: 'completed' } }, { $group: { _id: null, total: { $sum: '$amount' } } }])
    res.json({ total, todayCount, approved, pending, completed, revenue: revenue[0]?.total || 0 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const data = { ...req.body }
    if (req.user) data.user = req.user._id
    const booking = await Booking.create(data)
    res.status(201).json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const update = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(booking)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
