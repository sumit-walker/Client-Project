import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || true }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', (await import('./routes/auth.js')).default)
app.use('/api/users', (await import('./routes/users.js')).default)
app.use('/api/bookings', (await import('./routes/bookings.js')).default)
app.use('/api/portfolio', (await import('./routes/portfolio.js')).default)
app.use('/api/reviews', (await import('./routes/reviews.js')).default)
app.use('/api/contacts', (await import('./routes/contacts.js')).default)
app.use('/api/services', (await import('./routes/services.js')).default)
app.use('/api/settings', (await import('./routes/settings.js')).default)
app.use('/api/upload', (await import('./routes/upload.js')).default)

app.get('/api/health', (_, res) => res.json({ ok: true }))

export default app
