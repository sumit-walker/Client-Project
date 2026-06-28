import { useState, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Trash2, Pencil, Image as ImageIcon, X, Tag, List, Video, Type, Upload, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SectionHeader from '../../components/admin/SectionHeader'
import DeleteModal from '../../components/admin/DeleteModal'
import EmptyState from '../../components/admin/EmptyState'
import { motion } from 'framer-motion'

const categories = ['Bridal', 'Party', 'Engagement', 'HD Makeup', 'Airbrush', 'Fashion']

function MultiImageUpload({ images, onChange }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleFiles = async (files) => {
    setUploading(true)
    const uploaded = []
    for (const file of files) {
      const formData = new FormData()
      formData.append('image', file)
      try {
        const res = await api.post('/upload/image', formData)
        uploaded.push({ url: res.data.url, publicId: res.data.cloudinaryId })
      } catch {
        toast.error(`Failed to upload ${file.name}`)
      }
    }
    onChange([...images, ...uploaded])
    setUploading(false)
    if (uploaded.length > 0) toast.success(`${uploaded.length} image(s) uploaded`)
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
        {images.map((img, i) => (
          <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-base-200">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onChange(images.filter((_, j) => j !== i))} className="absolute top-1 right-1 size-5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-error transition-all flex items-center justify-center"><X className="size-3" /></button>
          </div>
        ))}
        {uploading && (
          <div className="aspect-[4/3] rounded-xl bg-base-200 flex items-center justify-center">
            <Loader2 className="size-5 animate-spin text-primary" />
          </div>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="aspect-[4/3] rounded-xl border-2 border-dashed border-base-300 hover:border-primary/50 hover:bg-base-200/50 transition-all flex flex-col items-center justify-center gap-1 text-base-content/40 hover:text-primary"
        >
          <Upload className="size-5" />
          <span className="text-[10px] font-medium">Upload</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => { if (e.target.files?.length) handleFiles(e.target.files) }} />
    </div>
  )
}

export default function AdminPortfolio() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', caption: '', category: 'Bridal', type: 'image', images: [] })
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({ queryKey: ['admin-portfolio'], queryFn: () => api.get('/portfolio').then(r => r.data) })

  const createMutation = useMutation({
    mutationFn: (data) => api.post('/portfolio', data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] }); toast.success('Added to portfolio'); resetForm() },
    onError: (err) => toast.error(err?.response?.data?.message || 'Failed'),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/portfolio/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] }); toast.success('Updated'); resetForm() },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/portfolio/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] }); toast.success('Deleted'); setDeleteTarget(null) },
  })

  const resetForm = () => { setForm({ title: '', caption: '', category: 'Bridal', type: 'image', images: [] }); setEditing(null); setShowForm(false) }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.images.length) { toast.error('Please upload at least one image'); return }
    const payload = { title: form.title, caption: form.caption, category: form.category, type: form.type, images: form.images }
    if (editing) updateMutation.mutate({ id: editing, data: payload })
    else createMutation.mutate(payload)
  }

  const startEdit = (item) => {
    setForm({ title: item.title, caption: item.caption || '', category: item.category, type: item.type, images: item.images?.length ? item.images : (item.image ? [{ url: item.image, publicId: item.cloudinaryId || '' }] : []) })
    setEditing(item._id); setShowForm(true)
  }

  return (
    <div>
      <SectionHeader
        title="Portfolio"
        description="Manage your portfolio images and videos"
        action={<button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn btn-primary h-11 min-h-11 px-5 sm:px-6 rounded-xl text-white gap-2 shadow-sm hover:shadow-md transition-all w-full sm:w-auto"><Plus className="size-4 shrink-0" /> {showForm ? 'Cancel' : 'Add New'}</button>}
      />

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm mb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base-200">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ImageIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">Upload Images</h3>
                    <p className="text-xs text-base-content/50">Upload multiple images — they will appear as a carousel</p>
                  </div>
                </div>
                <MultiImageUpload images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-base-200">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    {editing ? <Pencil className="size-5 text-primary" /> : <Plus className="size-5 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{editing ? 'Edit' : 'Add'} Details</h3>
                    <p className="text-xs text-base-content/50">Enter item information</p>
                  </div>
                </div>
                <div className="space-y-5">
                  <label className="form-control">
                    <span className="text-xs font-medium text-base-content/70 mb-1.5">Title</span>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
                      <input className="input input-bordered rounded-xl bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all pl-10 w-full text-sm" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Portfolio title" />
                    </div>
                  </label>
                  <label className="form-control">
                    <span className="text-xs font-medium text-base-content/70 mb-1.5">Caption</span>
                    <div className="relative">
                      <Type className="absolute left-3 top-3 size-4 text-base-content/30" />
                      <textarea className="textarea textarea-bordered rounded-xl bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all pl-10 w-full text-sm min-h-[60px]" rows="2" value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} placeholder="Optional caption" />
                    </div>
                  </label>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <label className="form-control">
                      <span className="text-xs font-medium text-base-content/70 mb-1.5">Category</span>
                      <div className="relative">
                        <List className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                        <select className="select select-bordered rounded-xl bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all pl-10 w-full text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                          {categories.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </label>
                    <label className="form-control">
                      <span className="text-xs font-medium text-base-content/70 mb-1.5">Type</span>
                      <div className="relative">
                        <Video className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                        <select className="select select-bordered rounded-xl bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all pl-10 w-full text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                          <option value="image">Image</option>
                          <option value="video">Video</option>
                        </select>
                      </div>
                    </label>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button type="submit" className="btn btn-primary rounded-xl text-white flex-1 shadow-sm hover:shadow-md transition-all" disabled={!form.images.length || createMutation.isPending || updateMutation.isPending}>
                      {(createMutation.isPending || updateMutation.isPending) ? <span className="loading loading-spinner loading-sm" /> : (editing ? 'Update' : 'Add to Portfolio')}
                    </button>
                    {editing && <button type="button" onClick={resetForm} className="btn btn-ghost rounded-xl">Cancel</button>}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-52 rounded-2xl" />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState icon={ImageIcon} title="No portfolio items yet" description="Upload your first image to showcase your work" action={<button onClick={() => setShowForm(true)} className="btn btn-primary rounded-xl text-white gap-2"><Plus className="size-4" /> Add New</button>} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item, i) => {
            const imgs = item.images?.length ? item.images : (item.image ? [{ url: item.image }] : [])
            return (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group rounded-2xl overflow-hidden bg-base-100 border border-base-200 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
                  {item.type === 'video' ? (
                    <video src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <img src={imgs[0]?.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 pointer-events-none" />
                  {imgs.length > 1 && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                      <ImageIcon className="size-3" /> {imgs.length}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="badge badge-primary badge-xs">{item.category}</span>
                    {item.type === 'video' && <span className="badge badge-info badge-xs">Video</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-base-200">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 text-base-content/50 hover:text-base-content"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className="btn btn-ghost btn-xs rounded-lg gap-1.5 px-2.5 text-base-content/50 hover:text-error"
                    >
                      <Trash2 className="size-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <DeleteModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget._id)}
        title="Delete portfolio item?"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        loading={deleteMutation.isPending}
      />
    </div>
  )
}
