import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  service: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventLocation: { type: String },
  time: { type: String },
  notes: { type: String },
  amount: { type: Number, default: 0 },
  advancePaid: { type: Boolean, default: false },
  status: { type: String, enum: ['pending', 'approved', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
