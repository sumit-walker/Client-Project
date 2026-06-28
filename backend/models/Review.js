import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true },
  image: { type: String },
  isApproved: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema)
