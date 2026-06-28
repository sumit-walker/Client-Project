import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  isReplied: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('ContactMessage', contactSchema)
