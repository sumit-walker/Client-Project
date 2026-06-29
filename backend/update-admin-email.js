import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'
import { config } from 'dotenv'
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: resolve(__dirname, '.env') })
import connectDB from './config/db.js'
import User from './models/User.js'

const update = async () => {
  await connectDB()
  const user = await User.findOne({ email: 'admin@mahimakeover.com' })
  if (!user) {
    console.log('No admin found with old email. Already updated or not seeded yet.')
    process.exit(0)
  }
  user.email = 'mahimakeover65@gmail.com'
  user.password = 'mahi@admin123'
  await user.save()
  console.log('Admin email → mahimakeover65@gmail.com, password updated')
  process.exit(0)
}

update()
