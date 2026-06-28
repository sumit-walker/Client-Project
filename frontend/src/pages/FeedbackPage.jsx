import { useState, useRef } from 'react'
import { Star, Heart, Send, Camera, X } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../services/api'
import AnimatedSection from '../components/ui/AnimatedSection'

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
        <div className="max-w-2xl mx-auto">
          <AnimatedSection variant="fadeUp">
            <form onSubmit={handleSubmit} className="bg-base-100 rounded-2xl shadow-xl border border-base-200 p-6 md:p-10 space-y-6">
              <div className="flex flex-col items-center gap-3">
                <button type="button" onClick={() => fileRef.current?.click()} className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-base-300 ring-offset-2 bg-base-200 flex items-center justify-center">
                    {preview ? (
                      <img src={preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="size-7 text-base-content/40" />
                    )}
                  </div>
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-medium text-base-content/50 whitespace-nowrap bg-base-100 px-2 py-0.5 rounded-full shadow-sm">Add photo</span>
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                {preview && (
                  <button type="button" onClick={clearImage} className="text-xs text-error flex items-center gap-1 hover:underline"><X className="size-3" /> Remove</button>
                )}
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <label className="form-control">
                  <span className="label-text font-medium mb-1.5 text-sm">Your Name *</span>
                  <input required className="input input-bordered rounded-xl w-full" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" />
                </label>
                <label className="form-control">
                  <span className="label-text font-medium mb-1.5 text-sm">Email</span>
                  <input type="email" className="input input-bordered rounded-xl w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="priya@example.com" />
                </label>
              </div>

              <label className="form-control">
                <span className="label-text font-medium mb-1.5 text-sm">Rating *</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setForm({ ...form, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-8 transition-colors ${
                          star <= (hoverRating || form.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-base-content/20'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </label>

              <label className="form-control">
                <span className="label-text font-medium mb-1.5 text-sm">Your Review *</span>
                <textarea
                  required
                  rows={4}
                  className="textarea textarea-bordered rounded-xl w-full resize-none"
                  value={form.text}
                  onChange={e => setForm({ ...form, text: e.target.value })}
                  placeholder="Tell us about your experience..."
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary btn-block rounded-xl text-white h-12 gap-2"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <><span className="loading loading-spinner loading-sm" /> Submitting...</>
                ) : (
                  <><Send className="size-4" /> Submit Review</>
                )}
              </button>

              <p className="text-xs text-base-content/40 text-center">
                Your review will be reviewed by our team before being published.
              </p>
            </form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}