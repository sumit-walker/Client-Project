import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, Clock, Package, IndianRupee, Tag, AlignLeft, List, Star, Eye, EyeOff, ImageUp, X, Loader2, Upload, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'
import { motion, Reorder } from 'framer-motion'
import api from '../../services/api'
import { serviceCategories } from '../../utils/helpers'
import SectionHeader from '../../components/admin/SectionHeader'
import DeleteModal from '../../components/admin/DeleteModal'
import EmptyState from '../../components/admin/EmptyState'
import Toggle from '../../components/ui/Toggle'

const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-base-content/40'
const inputClass = 'input w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 h-11 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors'
const inputWithIconClass = `${inputClass} pl-10`
const selectClass = 'select w-full rounded-lg border border-base-300/70 bg-base-200/70 pl-10 pr-3 h-11 text-sm text-base-content focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors'
const textareaClass = 'textarea w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 py-3 pl-10 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors min-h-[80px] resize-y leading-relaxed'

export default function AdminServices() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '', category: 'Bridal', images: [], features: '', isActive: true, featured: false })
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const queryClient = useQueryClient()

  const { data: services = [], isLoading } = useQuery({ queryKey: ['admin-services'], queryFn: () => api.get('/services/all').then(r => r.data) })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/services', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-services'] }); queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Service added'); resetForm() },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-services'] }); queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Updated'); resetForm() },
  })
  const toggleMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/services/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-services'] }); queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Updated') },
  })
  const reorderMutation = useMutation({
    mutationFn: (items) => api.put('/services/reorder', { items }),
    onSuccess: (res) => { queryClient.setQueryData(['admin-services'], res.data); queryClient.invalidateQueries({ queryKey: ['services'] }) },
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/services/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-services'] }); queryClient.invalidateQueries({ queryKey: ['services'] }); toast.success('Deleted'); setDeleteTarget(null) },
  })

  const resetForm = () => {
    setForm({ name: '', price: '', duration: '', description: '', category: 'Bridal', images: [], features: '', isActive: true, featured: false })
    setEditing(null); setShowForm(false)
  }

  const handleUpload = async (files) => {
    if (!files?.length) return
    setUploading(true)
    const uploaded = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await api.post('/upload/image', formData)
        uploaded.push({ url: res.data.url, publicId: res.data.cloudinaryId || '', cover: false })
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    setForm(prev => {
      const existing = prev.images
      const updated = [...existing, ...uploaded]
      if (existing.length === 0 && updated.length > 0) updated[0].cover = true
      return { ...prev, images: updated }
    })
    if (uploaded.length > 0) toast.success(`${uploaded.length} image(s) uploaded`)
    setUploading(false)
  }

  const removeImage = (index) => {
    setForm(prev => {
      const updated = prev.images.filter((_, i) => i !== index)
      if (prev.images[index]?.cover && updated.length > 0) updated[0].cover = true
      return { ...prev, images: updated }
    })
  }

  const setCover = (index) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({ ...img, cover: i === index })),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      name: form.name,
      price: Number(form.price),
      duration: form.duration,
      description: form.description,
      category: form.category,
      images: form.images,
      features: form.features.split(',').map(f => f.trim()).filter(Boolean),
      isActive: form.isActive,
      featured: form.featured,
    }
    if (editing) updateMutation.mutate({ id: editing, data })
    else createMutation.mutate(data)
  }

  const startEdit = (item) => {
    setForm({
      name: item.name, price: item.price, duration: item.duration,
      description: item.description, category: item.category,
      images: item.images?.length ? item.images : [],
      features: item.features?.join(', ') || '',
      isActive: item.isActive !== false, featured: item.featured || false,
    })
    setEditing(item._id); setShowForm(true)
  }

  const getCoverImage = (images) => images?.find(i => i.cover)?.url || images?.[0]?.url || ''

  return (
    <div>
      <SectionHeader title="Services" description="Manage your service offerings"
        action={
          showForm ? (
            <button type="button" onClick={resetForm} className="btn btn-ghost h-11 min-h-11 px-6 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200/60 font-medium transition-colors">
              Cancel
            </button>
          ) : (
            <button type="button" onClick={() => { resetForm(); setShowForm(true) }} className="btn h-11 min-h-11 px-5 sm:px-6 rounded-xl border-0 bg-primary text-white font-semibold gap-2 shadow-md shadow-primary/30 hover:brightness-110 hover:shadow-lg transition-all w-full sm:w-auto">
              <Plus className="size-4 shrink-0" /> Add Service
            </button>
          )
        }
      />

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm mb-8 max-w-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              {editing ? <Pencil className="size-5 text-primary" /> : <Plus className="size-5 text-primary" />}
            </div>
            <div>
              <h3 className="font-semibold text-base">{editing ? 'Edit Service' : 'Add New Service'}</h3>
              <p className="text-xs text-base-content/50">Fill in the details below</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="form-control flex flex-col gap-2.5">
                <span className={labelClass}>Service Name</span>
                <div className="relative">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                  <input className={inputWithIconClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required placeholder="e.g. Signature Bridal Makeup" />
                </div>
              </label>
              <label className="form-control flex flex-col gap-2.5">
                <span className={labelClass}>Price (₹)</span>
                <div className="relative">
                  <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                  <input type="number" className={inputWithIconClass} value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required placeholder="40000" />
                </div>
              </label>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <label className="form-control flex flex-col gap-2.5">
                <span className={labelClass}>Duration</span>
                <div className="relative">
                  <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                  <input className={inputWithIconClass} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} required placeholder="3-4 hrs" />
                </div>
              </label>
              <label className="form-control flex flex-col gap-2.5">
                <span className={labelClass}>Category</span>
                <div className="relative">
                  <List className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                  <select className={selectClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {serviceCategories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </label>
            </div>

            <div className="flex flex-col gap-2.5">
              <span className={labelClass}>Service Images</span>
              <div className="mb-3">
                <Reorder.Group axis="x" values={form.images} onReorder={(ordered) => setForm({ ...form, images: ordered })} className="flex flex-wrap gap-3">
                  {form.images.map((img, i) => (
                    <Reorder.Item key={img.url} value={img} className="relative group w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 cursor-grab active:cursor-grabbing" onClick={() => setCover(i)}>
                      <img src={img.url} alt="" className="w-full h-full object-cover pointer-events-none" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i) }} className="btn btn-ghost btn-xs text-white hover:bg-white/20"><X className="size-3" /></button>
                      </div>
                      {img.cover && <span className="absolute bottom-0 left-0 right-0 bg-primary text-white text-[10px] font-semibold text-center py-0.5 pointer-events-none">Cover</span>}
                      {!img.cover && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                        <span className="text-white text-[10px] bg-black/60 px-2 py-0.5 rounded">Set Cover</span>
                      </div>}
                    </Reorder.Item>
                  ))}
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}
                    className="w-20 h-20 rounded-xl border-2 border-dashed border-base-300 hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-base-content/30 hover:text-primary transition-all shrink-0"
                  >
                    {uploading ? <Loader2 className="size-5 animate-spin" /> : <><Upload className="size-5" /><span className="text-[10px]">Upload</span></>}
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleUpload([...e.target.files]); e.target.value = '' }} />
                </Reorder.Group>
              </div>
              <p className="text-[11px] text-base-content/40">Click an image to set as cover. Upload multiple images to create a slider.</p>
            </div>

            <label className="form-control flex flex-col gap-2.5">
              <span className={labelClass}>Description</span>
              <div className="relative">
                <AlignLeft className="absolute left-3.5 top-3.5 size-4 text-base-content/30 pointer-events-none" />
                <textarea className={textareaClass} rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required placeholder="Describe this service..." />
              </div>
            </label>
            <label className="form-control flex flex-col gap-2.5">
              <span className={labelClass}>Features (comma separated)</span>
              <input className={inputClass} value={form.features} onChange={e => setForm({ ...form, features: e.target.value })} placeholder="Professional Makeup, Premium Products, Hairstyling Included" />
            </label>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="form-control flex flex-row items-center gap-3 p-3 bg-base-200 rounded-xl">
                <Toggle id="service-featured" color="primary" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <div><span className="text-sm font-medium">Featured</span><p className="text-xs text-base-content/50">Show on homepage</p></div>
              </div>
              <div className="form-control flex flex-row items-center gap-3 p-3 bg-base-200 rounded-xl">
                <Toggle id="service-active" color="success" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                <div><span className="text-sm font-medium">Active</span><p className="text-xs text-base-content/50">Available for booking</p></div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-5 mt-1 border-t border-base-200">
              <button type="button" onClick={resetForm} className="btn btn-ghost h-11 min-h-11 px-6 rounded-xl text-base-content/70 hover:text-base-content hover:bg-base-200/60 font-medium transition-colors">
                Cancel
              </button>
              <button type="submit" className="btn h-11 min-h-11 px-8 rounded-xl border-0 bg-primary text-white font-semibold shadow-md shadow-primary/30 hover:brightness-110 hover:shadow-lg transition-all disabled:opacity-60" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) ? <span className="loading loading-spinner loading-sm" /> : (editing ? 'Update Service' : 'Add Service')}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-56 rounded-2xl" />)}
        </div>
      ) : services.length === 0 ? (
        <EmptyState icon={Package} title="No services yet" description="Create your first service to start accepting bookings" action={<button onClick={() => setShowForm(true)} className="btn h-11 min-h-11 rounded-xl border-0 bg-primary text-white font-semibold gap-2 shadow-md shadow-primary/30 hover:brightness-110 hover:shadow-lg transition-all"><Plus className="size-4" /> Add Service</button>} />
      ) : (
        <Reorder.Group axis="y" values={services} onReorder={(ordered) => { queryClient.setQueryData(['admin-services'], ordered); reorderMutation.mutate(ordered.map(({ _id }) => ({ _id }))) }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Reorder.Item
              key={s._id}
              value={s}
              className={`group bg-base-100 rounded-2xl border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 ${s.isActive === false ? 'border-base-300 opacity-60' : 'border-base-200'}`}
            >
              <div className="relative h-40 overflow-hidden bg-base-200">
                {s.images?.length > 0 && getCoverImage(s.images) ? (
                  <img src={getCoverImage(s.images)} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                ) : s.image ? (
                  <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-base-content/20"><Package className="size-12" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-3 left-3 cursor-grab active:cursor-grabbing text-white/60 hover:text-white transition-colors">
                  <GripVertical className="size-5" />
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  {s.featured && <span className="badge badge-warning badge-xs shadow-sm gap-1"><Star className="size-2.5" /> Featured</span>}
                  {s.images?.length > 1 && <span className="badge badge-ghost badge-xs shadow-sm">{s.images.length} photos</span>}
                </div>
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="badge badge-primary badge-sm shadow-sm">₹{s.price?.toLocaleString()}</span>
                  {s.isActive === false && <span className="badge badge-ghost badge-sm shadow-sm gap-1"><EyeOff className="size-2.5" /> Inactive</span>}
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-sm truncate">{s.name}</h4>
                    <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                      <Clock className="size-3" /> {s.duration}
                      <span className="mx-1.5 text-base-content/20">|</span>
                      <span className="badge badge-ghost badge-xs">{s.category}</span>
                    </p>
                  </div>
                </div>
                <p className="text-xs text-base-content/60 mt-3 leading-relaxed line-clamp-2">{s.description}</p>
                {s.features?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {s.features.slice(0, 3).map(f => <span key={f} className="badge badge-ghost badge-xs">{f}</span>)}
                    {s.features.length > 3 && <span className="badge badge-ghost badge-xs">+{s.features.length - 3}</span>}
                  </div>
                )}
                <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-base-200">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleMutation.mutate({ id: s._id, data: { featured: !s.featured } })}
                      className={`btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 ${s.featured ? 'text-warning' : 'text-base-content/50 hover:text-base-content'}`}
                      disabled={toggleMutation.isPending}
                    >
                      <Star className={`size-3.5 ${s.featured ? 'fill-current' : ''}`} /> {s.featured ? 'Featured' : 'Feature'}
                    </button>
                    <button
                      onClick={() => toggleMutation.mutate({ id: s._id, data: { isActive: !s.isActive } })}
                      className="btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 text-base-content/50 hover:text-base-content"
                      disabled={toggleMutation.isPending}
                    >
                      {s.isActive ? <><EyeOff className="size-3.5" /> Hide</> : <><Eye className="size-3.5" /> Show</>}
                    </button>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button onClick={() => startEdit(s)} className="btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 text-base-content/50 hover:text-base-content">
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(s)} className="btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 text-base-content/50 hover:text-error">
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget._id)} title={`Delete "${deleteTarget?.name}"?`} loading={deleteMutation.isPending} />
    </div>
  )
}