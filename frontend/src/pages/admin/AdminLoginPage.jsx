import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Sparkles, X, ArrowLeft } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
  const { user, adminLogin } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  if (user?.role === 'admin') return <Navigate to="/admin" replace />
  if (user && user.role !== 'admin') return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await adminLogin(form.email, form.password)
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4 relative">
      <Link
        to="/"
        className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 rounded-full bg-base-100/90 backdrop-blur border border-base-200 text-base-content/60 hover:text-base-content hover:bg-base-200 transition-colors shadow-sm"
        aria-label="Back to website"
      >
        <X className="size-5" />
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <Sparkles className="size-7 text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-base-content">Admin Login</h1>
          <p className="text-sm text-base-content/50 mt-1">Sign in to manage your dashboard</p>
        </div>

        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="form-control">
              <span className="label-text font-medium mb-1.5 text-sm">Email</span>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                <input type="email" required className="input input-bordered rounded-xl pl-10 w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="admin@mahimakeover.com" />
              </div>
            </label>

            <label className="form-control">
              <span className="label-text font-medium mb-1.5 text-sm">Password</span>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                <input type={showPw ? 'text' : 'password'} required className="input input-bordered rounded-xl pl-10 pr-10 w-full" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter password" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/30 hover:text-base-content">
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>

            <button type="submit" className="btn btn-primary btn-block rounded-xl text-white h-11" disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-base-content/40 mt-6 space-y-3">
          <Link to="/" className="flex items-center justify-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors">
            <ArrowLeft className="size-4" />
            Back to website
          </Link>
        </p>
      </motion.div>
    </div>
  )
}