import mongoose from 'mongoose'

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true })

const SiteSetting = mongoose.model('SiteSetting', settingSchema)

export const defaultSettings = {
  siteName: 'Mahi Makeover',
  phone: '+91 9174568852',
  whatsapp: '919174568852',
  instagram: 'mahimakeover65',
  facebook: 'mahimakeover65',
  address: 'Dane Baba Road, DD Nagar, Shahpuri-Puram, Gwalior',
  mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3603.5!2d78.1821!3d26.2183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3971bec4391c300f%3A0x95ebae476a4fb98!2sGwalior%2C%20Madhya%20Pradesh!5e0!3m2!1sen!2sin!4v1',
  email: 'mahimakeover65@gmail.com',
  openingHours: 'Mon-Sat: 10:00 AM - 8:00 PM',
  heroTitle: 'Your Beauty, Our Passion',
  heroSubtitle: 'Premium bridal & event makeup in Gwalior',
  heroImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920',
  aboutTitle: 'Meet Muskan Thakur',
  aboutText: 'Led by makeup artist Muskan Thakur and studio owner Raghav Thakur, Mahi Makeover specializes in bridal, engagement, reception, and party makeup — from HD to celebrity finishes.',
  aboutImage: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800',
  logo: '',
  footerText: 'Professional makeup artistry for brides & special occasions in Gwalior.',
  faqs: [
    { q: 'How do I book?', a: 'Book through our website or WhatsApp at +91 9174568852.' },
    { q: 'What packages do you offer?', a: 'We offer HD, Air Brush, and Celebrity makeup tiers for Haldi, Engagement, Bridal, Party, and Reception — plus a Pre Bridal package.' },
    { q: 'Cancellation policy?', a: 'Please contact us at least 48 hours before your appointment.' },
  ],
}

export const seedSettings = async () => {
  for (const [key, value] of Object.entries(defaultSettings)) {
    await SiteSetting.findOneAndUpdate({ key }, { value }, { upsert: true })
  }
}

export default SiteSetting
