import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Phone, Eye, EyeOff, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { SITE } from '../constants/site'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success(`Welcome to ${SITE.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-stretch -mt-16">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary via-primary/80 to-accent relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/80" />
        <div className="relative z-10 text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15 }}>
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="size-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-4xl font-display font-bold text-white mb-3">Join Us Today</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white/80 text-lg">Create your account and get started</motion.p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-10 space-y-4 text-left">
            {['Book appointments with ease', 'View your booking history', 'Get exclusive offers & updates'].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-white/70"><div className="w-1.5 h-1.5 rounded-full bg-white/60" /><span className="text-sm">{text}</span></div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-base-100">
        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }} className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="font-display text-3xl font-bold"><span className="text-primary">Mahi</span><span className="text-base-content"> Makeover</span></Link>
            <p className="text-base-content/50 mt-2 text-sm">Create your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
              <span className="label-text font-medium mb-1.5 text-sm">Full Name</span>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                <input type="text" required className="input input-bordered rounded-xl pl-10 w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1.5 text-sm">Email</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                <input type="email" required className="input input-bordered rounded-xl pl-10 w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
              </div>
            </label>

            <div className="grid sm:grid-cols-2 gap-4">
              <label className="form-control">
                <span className="label-text font-medium mb-1.5 text-sm">Phone</span>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                  <input type="tel" className="input input-bordered rounded-xl pl-10 w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone" />
                </div>
              </label>

              <label className="form-control">
                <span className="label-text font-medium mb-1.5 text-sm">Password</span>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                  <input type={showPw ? 'text' : 'password'} required minLength={6} className="input input-bordered rounded-xl pl-10 pr-10 w-full" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Min 6 chars" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content">
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>
            </div>

            <button type="submit" className="btn btn-primary btn-block rounded-xl text-white h-11 mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Create Account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-base-200" /></div>
            <div className="relative flex justify-center text-xs"><span className="bg-base-100 px-4 text-base-content/40">Already have an account?</span></div>
          </div>

          <Link to="/login" className="btn btn-outline btn-block rounded-xl h-11">Sign In</Link>
        </motion.div>
      </div>
    </div>
  )
}
