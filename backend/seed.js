import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import User from './models/User.js'
import Service from './models/Service.js'
import { seedSettings } from './models/SiteSetting.js'

const img = 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800'

const fullPackage = ['Makeup', 'Draping', 'Hairstyle', 'Eyelashes', 'Eyelenses', 'Hair Accessories']
const standardPackage = ['Makeup', 'Draping', 'Hairstyle', 'Eyelashes']
const partyPackage = ['Makeup', 'Draping', 'Hairstyle']

const services = [
  // Haldi
  { name: 'Haldi — HD Makeup', price: 8000, duration: '1-2 hrs', description: 'HD makeup for your Haldi ceremony with a fresh, radiant finish.', category: 'Haldi', images: [{ url: img, cover: true }], features: ['HD Makeup', 'Long-lasting Finish'], featured: true, isActive: true, sortOrder: 1 },
  { name: 'Haldi — Air Brush Makeup', price: 10000, duration: '1-2 hrs', description: 'Flawless air brush makeup for a smooth, camera-ready Haldi look.', category: 'Haldi', images: [{ url: img, cover: true }], features: ['Air Brush Makeup', 'Long-lasting Finish'], featured: false, isActive: true, sortOrder: 2 },
  { name: 'Haldi — Celebrity Makeup', price: 12000, duration: '1-2 hrs', description: 'Premium celebrity-style makeup for your Haldi celebration.', category: 'Haldi', images: [{ url: img, cover: true }], features: ['Celebrity Makeup', 'Premium Products'], featured: false, isActive: true, sortOrder: 3 },
  // Engagement
  { name: 'Engagement — HD Makeup', price: 12000, duration: '2-3 hrs', description: 'Stunning HD engagement look with full styling included.', category: 'Engagement', images: [{ url: img, cover: true }], features: fullPackage, featured: true, isActive: true, sortOrder: 4 },
  { name: 'Engagement — Air Brush Makeup', price: 14000, duration: '2-3 hrs', description: 'Air brush engagement makeup with draping and hairstyling.', category: 'Engagement', images: [{ url: img, cover: true }], features: fullPackage, featured: false, isActive: true, sortOrder: 5 },
  { name: 'Engagement — Celebrity Makeup', price: 16000, duration: '2-3 hrs', description: 'Celebrity finish engagement makeup for your special day.', category: 'Engagement', images: [{ url: img, cover: true }], features: fullPackage, featured: false, isActive: true, sortOrder: 6 },
  // Bridal
  { name: 'Bridal — HD Makeup', price: 28000, duration: '3-4 hrs', description: 'Complete bridal HD makeup with draping, hairstyle, and premium inclusions.', category: 'Bridal', images: [{ url: img, cover: true }], features: fullPackage, featured: true, isActive: true, sortOrder: 7 },
  { name: 'Bridal — Air Brush Makeup', price: 32000, duration: '3-4 hrs', description: 'Luxury air brush bridal makeup for a flawless wedding day look.', category: 'Bridal', images: [{ url: img, cover: true }], features: fullPackage, featured: false, isActive: true, sortOrder: 8 },
  { name: 'Bridal — Celebrity Makeup', price: 35000, duration: '3-4 hrs', description: 'Our premium celebrity bridal package for the ultimate wedding glow.', category: 'Bridal', images: [{ url: img, cover: true }], features: fullPackage, featured: false, isActive: true, sortOrder: 9 },
  // Party
  { name: 'Party — HD Makeup', price: 4000, duration: '1 hr', description: 'Glamorous HD party makeup with draping and hairstyle.', category: 'Party', images: [{ url: img, cover: true }], features: partyPackage, featured: true, isActive: true, sortOrder: 10 },
  { name: 'Party — Air Brush Makeup', price: 4500, duration: '1 hr', description: 'Air brush party makeup for a flawless night-out look.', category: 'Party', images: [{ url: img, cover: true }], features: partyPackage, featured: false, isActive: true, sortOrder: 11 },
  { name: 'Party — Celebrity Makeup', price: 5000, duration: '1 hr', description: 'Celebrity-style party makeup with full styling.', category: 'Party', images: [{ url: img, cover: true }], features: partyPackage, featured: false, isActive: true, sortOrder: 12 },
  // Reception
  { name: 'Reception — HD Makeup', price: 10000, duration: '2-3 hrs', description: 'Elegant reception HD makeup with draping, hairstyle, and eyelashes.', category: 'Reception', images: [{ url: img, cover: true }], features: standardPackage, featured: false, isActive: true, sortOrder: 13 },
  { name: 'Reception — Air Brush Makeup', price: 12500, duration: '2-3 hrs', description: 'Sophisticated air brush reception look built to last all evening.', category: 'Reception', images: [{ url: img, cover: true }], features: standardPackage, featured: false, isActive: true, sortOrder: 14 },
  { name: 'Reception — Celebrity Makeup', price: 15000, duration: '2-3 hrs', description: 'Premium celebrity reception makeup for your grand celebration.', category: 'Reception', images: [{ url: img, cover: true }], features: standardPackage, featured: false, isActive: true, sortOrder: 15 },
  // Pre Bridal
  {
    name: 'Pre Bridal Package',
    price: 20000,
    duration: 'Full package',
    description: 'Complete pre-bridal grooming package to prepare you for your wedding day.',
    category: 'Pre Bridal',
    images: [{ url: img, cover: true }],
    features: [
      'O3+ Cleanup (1 sitting)',
      'D-Tan Bleach Face & Neck (1 sitting)',
      'Full Body Wax Rica (1 sitting)',
      'Full Body Bleach (1 sitting)',
      'Body Polishing (1 sitting)',
      'B-Wax Rica (1 sitting)',
      'Hair Spa (1 sitting)',
      'Deluxe Manicure & Pedicure (1 sitting)',
      'Nail Extension',
    ],
    featured: true,
    isActive: true,
    sortOrder: 16,
  },
]

const seed = async () => {
  await connectDB()

  try { await User.collection.dropIndex('username_1') } catch {}
  try { await User.collection.dropIndex('email_1') } catch {}
  await User.deleteMany()
  await User.create({ name: 'Admin', email: 'admin@mahimakeover.com', password: 'admin123', role: 'admin', phone: '+91 9174568852' })
  console.log('Users seeded')

  await Service.deleteMany()
  await Service.insertMany(services)
  console.log('Services seeded')

  await seedSettings()
  console.log('Settings seeded')

  console.log('Database seeded for Mahi Makeover!')
  process.exit(0)
}

seed()
