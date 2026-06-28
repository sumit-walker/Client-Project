import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const genToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })

export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password, phone })
    res.status(201).json({ token: genToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' })
    res.json({ token: genToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' })
    }
    if (user.isBlocked) return res.status(403).json({ message: 'Account blocked' })
    res.json({ token: genToken(user._id), user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getMe = async (req, res) => {
  res.json(req.user)
}

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
