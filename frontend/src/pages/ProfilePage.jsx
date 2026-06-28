import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loading: authLoading, updateUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', avatar: user?.avatar || '' })
  const [saving, setSaving] = useState(false)

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
  if (!user) return <Navigate to="/login" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await api.put('/auth/profile', form)
      updateUser(res.data)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-base-100">
      <div className="max-w-lg mx-auto">
        <h1 className="font-display text-3xl md:text-4xl mb-8">My Profile</h1>
        <form onSubmit={handleSubmit} className="bg-base-200 p-8 rounded-2xl shadow-md border border-base-200 space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="avatar"><div className="w-16 rounded-full ring-2 ring-primary/30"><img src={form.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'} alt={user.name} /></div></div>
            <div><p className="font-semibold">{user.name}</p><p className="text-sm text-base-content/60">{user.email}</p></div>
          </div>
          <label className="form-control"><span className="label-text font-medium mb-1">Name</span><input type="text" className="input input-bordered rounded-xl" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
          <label className="form-control"><span className="label-text font-medium mb-1">Phone</span><input type="tel" className="input input-bordered rounded-xl" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
          <label className="form-control"><span className="label-text font-medium mb-1">Avatar URL</span><input type="url" className="input input-bordered rounded-xl" value={form.avatar} onChange={e => setForm({ ...form, avatar: e.target.value })} /></label>
          <button type="submit" className="btn btn-primary btn-block rounded-full text-white" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>
      </div>
    </div>
  )
}
