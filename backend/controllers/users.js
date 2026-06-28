import User from '../models/User.js'
import Booking from '../models/Booking.js'

export const getAll = async (req, res) => {
  try {
    const { search } = req.query
    const query = search
      ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] }
      : {}
    const users = await User.find(query).sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const toggleBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })
    user.isBlocked = !user.isBlocked
    await user.save()
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.id }).sort({ createdAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const saveLook = async (req, res) => {
  try {
    const { portfolioId } = req.body
    const user = req.user
    const idx = user.savedLooks.indexOf(portfolioId)
    if (idx > -1) user.savedLooks.splice(idx, 1)
    else user.savedLooks.push(portfolioId)
    await user.save()
    res.json(user.savedLooks)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
