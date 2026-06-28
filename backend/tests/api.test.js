import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import app from '../app.js'
import connectDB from '../config/db.js'

beforeAll(async () => { await connectDB() }, 15000)
afterAll(async () => { await mongoose.disconnect() })

describe('API Health', () => {
  it('GET /api/health returns ok', async () => {
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})

describe('Auth', () => {
  it('POST /api/auth/login with wrong credentials returns 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'wrong' })
    expect(res.status).toBe(401)
  })
})

describe('Services', () => {
  it('GET /api/services returns array', async () => {
    const res = await request(app).get('/api/services')
    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })
})
