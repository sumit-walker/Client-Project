import { useState, useRef } from 'react'
import { Star, Heart, Send, Camera, X, User, Mail, MessageSquare } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'
import AnimatedSection from '../components/ui/AnimatedSection'

const labelClass = 'block text-[11px] font-semibold uppercase tracking-wider text-base-content/40'
const inputClass = 'input w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 h-11 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors'
const textareaClass = 'textarea w-full rounded-lg border border-base-300/70 bg-base-200/70 px-3.5 py-3 text-sm text-base-content placeholder:text-base-content/30 focus:border-primary/60 focus:bg-base-200 focus:outline-none focus:ring-1 focus:ring-primary/20 transition-colors resize-none leading-relaxed'

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', email: '', rating: 5, text: '' })
  const [hoverRating, setHoverRating] = useState(0)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const fileRef = useRef(null)

  const mutation = useMutation({
    mutationFn: async (data) => {
      let image = ''
      if (imageFile) {
        const fd = new FormData()
        fd.append('image', imageFile)
        const uploadRes = await api.post('/upload/public', fd)
        image = uploadRes.data.url
      }
      return api.post('/reviews', { ...data, image: image || undefined })
    },
    onSuccess: () => {
      toast.success('Thank you! Your review will be visible after admin approval.')
      setForm({ name: '', email: '', rating: 5, text: '' })
      setImageFile(null)
      setPreview('')
    },
    onError: () => toast.error('Failed to submit review. Please try again.'),
  })

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast.error('Image must be under 2MB'); return }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const clearImage = () => {
    setImageFile(null)
    setPreview('')
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    mutation.mutate(form)
  }

  const activeRating = hoverRating || form.rating

  return (
    <div>
      <section className="relative pt-24 md:pt-28 lg:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-base-200 via-base-100 to-base-200" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Heart className="size-10 text-primary mx-auto mb-4" />
            <h1 className="font-display text-3xl sm:text-4xl md:text-6xl font-bold text-base-content">Share Your Feedback</h1>
            <p className="text-base-content/60 max-w-xl mx-auto mt-3 text-sm md:text-base">We value your opinion. Let us know about your experience!</p>
          </motion.div>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-4">
        <div className="max-w-xl mx-auto">
          <AnimatedSection variant="fadeUp">
            <form onSubmit={handleSubmit} className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 sm:p-8 md:p-10 space-y-8">
              <div className="text-center pb-6 border-b border-base-200">
                <span className={labelClass}>Profile Photo</span>
                <div className="mt-3 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className={`relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition-all ${
                      preview
                        ? 'border-2 border-primary ring-2 ring-primary/20'
                        : 'border-2 border-dashed border-base-300 bg-base-200/70 hover:border-primary/50 hover:bg-base-200'
                    }`}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="size-8 text-base-content/35" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-base-content/70">
                      {preview ? 'Photo added' : 'Add a photo'}
                    </p>
                    <p className="text-xs text-base-content/40">Optional · JPG or PNG, max 2MB</p>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                  {preview && (
                    <button type="button" onClick={clearImage} className="text-xs text-error flex items-center gap-1 hover:underline">
                      <X className="size-3.5" /> Remove photo
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <label className="form-control flex flex-col gap-2.5">
                    <span className={labelClass}>Your Name *</span>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                      <input required className={`${inputClass} pl-10`} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" />
                    </div>
                  </label>
                  <label className="form-control flex flex-col gap-2.5">
                    <span className={labelClass}>Email <span className="normal-case tracking-normal font-normal text-base-content/30">(optional)</span></span>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/30 pointer-events-none" />
                      <input type="email" className={`${inputClass} pl-10`} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="priya@example.com" />
                    </div>
                  </label>
                </div>

                <label className="form-control flex flex-col gap-2.5">
                  <span className={labelClass}>Rating *</span>
                  <div className="rounded-xl border border-base-300/70 bg-base-200/70 px-4 py-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setForm({ ...form, rating: star })}
                          className="p-1.5 rounded-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30"
                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`size-7 sm:size-8 transition-colors ${
                              star <= activeRating ? 'fill-yellow-400 text-yellow-400' : 'text-base-content/20'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-medium text-base-content/60">
                      {ratingLabels[activeRating]} · {activeRating}/5
                    </p>
                  </div>
                </label>

                <label className="form-control flex flex-col gap-2.5">
                  <span className={labelClass}>Your Review *</span>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3.5 size-4 text-base-content/30 pointer-events-none" />
                    <textarea
                      required
                      rows={5}
                      className={`${textareaClass} pl-10 min-h-[120px]`}
                      value={form.text}
                      onChange={e => setForm({ ...form, text: e.target.value })}
                      placeholder="Tell us about your experience..."
                    />
                  </div>
                </label>
              </div>

              <div className="space-y-4 pt-2 border-t border-base-200">
                <button
                  type="submit"
                  className="btn h-12 min-h-12 w-full rounded-xl border-0 bg-primary text-white font-semibold gap-2 shadow-md shadow-primary/25 hover:brightness-110 hover:shadow-lg transition-all disabled:opacity-60"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? (
                    <><span className="loading loading-spinner loading-sm" /> Submitting...</>
                  ) : (
                    <><Send className="size-4" /> Submit Review</>
                  )}
                </button>
                <p className="text-xs text-base-content/40 text-center leading-relaxed">
                  Your review will be reviewed by our team before being published.
                </p>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
