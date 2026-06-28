import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  caption: { type: String },
  image: { type: String },
  cloudinaryId: { type: String },
  images: [{ url: String, publicId: String }],
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  category: { type: String, required: true, enum: ['Bridal', 'Party', 'Engagement', 'HD Makeup', 'Airbrush', 'Fashion'] },
}, { timestamps: true })

export default mongoose.model('Portfolio', portfolioSchema)
