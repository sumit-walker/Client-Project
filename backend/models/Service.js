import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['Bridal', 'Party', 'Engagement', 'Reception', 'Haldi', 'Pre Bridal'] },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String, default: '' },
    cover: { type: Boolean, default: false },
  }],
  features: [{ type: String }],
  sortOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Service', serviceSchema)
