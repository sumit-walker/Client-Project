import { useState } from 'react'
import { Navigate, useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, CalendarCheck, Image, Star, Shield, X, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { SITE } from '../constants/site'

const features = [
  { icon: CalendarCheck, title: 'Manage Bookings', desc: 'Approve, schedule & track every appointment' },
  { icon: Image, title: 'Portfolio Control', desc: 'Upload and organize your best work' },
  { icon: Star, title: 'Reviews & Messages', desc: 'Respond to clients in one place' },
]

const stats = [
  { value: '500+', label: 'Happy Brides' },
  { value: '8+', label: 'Years Experience' },
  { value: '24/7', label: 'Dashboard Access' },
]

const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-base-content/45'
const fieldWrapClass = 'form-control w-full flex flex-col gap-2.5'
const inputClass = 'input w-full rounded-xl border border-base-300/70 bg-base-200/70 pl-11 pr-4 h-12 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors'

export default function LoginPage() {
  const { user, loading, login, logout } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-base-100"><span className="loading loading-spinner loading-lg text-primary" /></div>
  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await login(form.email, form.password)
      if (res.user.role !== 'admin') {
        logout()
        toast.error('Access denied. Admin only.')
        return
      }
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      <Link
        to="/"
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-base-100/90 backdrop-blur border border-base-200 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors shadow-sm"
        aria-label="Back to website"
      >
        <X className="size-5" />
      </Link>
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/40" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 w-80 h-80 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="font-display text-2xl font-bold text-white">
              <span className="text-primary">Mahi</span> Makeover
            </p>
            <p className="text-white/50 text-sm mt-1 tracking-wide">Luxury Makeup Artistry</p>
          </motion.div>

          <div className="space-y-10">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-primary text-xs font-medium mb-6">
                <Shield className="size-3.5" />
                Secure Admin Portal
              </div>
              <h1 className="font-display text-5xl xl:text-6xl font-bold text-white leading-[1.1]">
                Mahi Makeover<br />
                <span className="text-primary">Admin Portal</span>
              </h1>
              <p className="text-white/65 text-lg mt-5 max-w-md leading-relaxed">
                Manage bookings, services, portfolio & client messages for {SITE.name} in Gwalior.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="grid gap-3"
            >
              {features.map(({ icon: Icon, title, desc }, i) => (
                <div
                  key={title}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                    <Icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{title}</p>
                    <p className="text-white/50 text-xs mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex gap-8"
          >
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-display font-bold text-primary">{value}</p>
                <p className="text-white/45 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-base-200/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-lg"><span className="text-primary">Mahi</span> Makeover</p>
              <p className="text-xs text-base-content/50">Admin Portal</p>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl border border-base-200 shadow-xl p-7 sm:p-8">
            <div className="mb-8">
              <h2 className="font-display text-2xl font-bold text-base-content">Admin Login</h2>
              <p className="text-sm text-base-content/50 mt-1.5">Authorized personnel only</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <label className={fieldWrapClass}>
                <span className={labelClass}>Email</span>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/35 pointer-events-none" />
                  <input
                    type="email"
                    required
                    className={inputClass}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@mahimakeover.com"
                  />
                </div>
              </label>

              <label className={fieldWrapClass}>
                <span className={labelClass}>Password</span>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/35 pointer-events-none" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    className={`${inputClass} pr-11`}
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/35 hover:text-base-content transition-colors"
                  >
                    {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className="btn w-full h-12 min-h-12 mt-1 rounded-xl border-0 bg-primary text-white font-semibold text-sm shadow-md shadow-primary/30 hover:brightness-110 hover:shadow-lg transition-all disabled:opacity-60"
                disabled={submitting}
              >
                {submitting ? <span className="loading loading-spinner loading-sm" /> : 'Sign In'}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-base-content/40 mt-6">
            Only admin accounts can sign in
          </p>
          <Link to="/" className="mt-4 flex items-center justify-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
            Back to website
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
