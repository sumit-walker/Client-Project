import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image, X, Loader2 } from 'lucide-react'
import api from '../../services/api'
import toast from 'react-hot-toast'

export default function UploadZone({ onUpload, className = '' }) {
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    setProgress(10)

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await api.post('/upload/image', formData, {
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 80) + 10),
      })
      setProgress(100)
      const data = res.data
      toast.success('Uploaded successfully')
      onUpload?.(data)
      setTimeout(() => { setPreview(null); setProgress(0) }, 1500)
    } catch {
      toast.error('Upload failed')
      setPreview(null)
      setProgress(0)
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div className={className}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300 text-center
          ${dragOver ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-base-300 hover:border-primary/50 hover:bg-base-200/50'}
          ${preview ? 'p-2' : 'p-8'}`}
      >
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />

        {preview ? (
          <div className="relative inline-block">
            <img src={preview} alt="Preview" className="max-h-48 rounded-xl object-contain" />
            {!uploading && (
              <button onClick={(e) => { e.stopPropagation(); setPreview(null) }} className="absolute -top-2 -right-2 btn btn-circle btn-xs btn-error text-white">
                <X className="size-3" />
              </button>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-black/50 rounded-xl flex flex-col items-center justify-center gap-2">
                <Loader2 className="size-6 animate-spin text-white" />
                <div className="w-32 h-1.5 bg-white/30 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-white rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
            )}
          </div>
        ) : (
          <motion.div animate={{ scale: dragOver ? 1.05 : 1 }} className="space-y-3">
            <div className="flex justify-center">
              <div className="p-4 rounded-2xl bg-primary/10">
                {uploading ? <Loader2 className="size-8 animate-spin text-primary" /> : <Upload className="size-8 text-primary" />}
              </div>
            </div>
            <p className="text-sm font-medium">Drop image here or click to browse</p>
            <p className="text-xs text-base-content/40">Supports JPG, PNG, WebP — max 10MB</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
