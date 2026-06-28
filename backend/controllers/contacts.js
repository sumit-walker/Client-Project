import ContactMessage from '../models/ContactMessage.js'

export const getAll = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const create = async (req, res) => {
  try {
    const msg = await ContactMessage.create(req.body)
    res.status(201).json(msg)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

export const markReplied = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { isReplied: true }, { new: true })
    res.json(msg)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const remove = async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id)
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
