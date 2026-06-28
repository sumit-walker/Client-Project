import { useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function Lightbox({ items, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrev) onPrev()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [onClose, onPrev, onNext])

  const item = items?.[index]
  if (!item) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button className="absolute top-5 right-5 btn btn-circle btn-ghost text-white" onClick={onClose}><X className="size-6" /></button>
      {onPrev && items.length > 1 && <button className="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white" onClick={(e) => { e.stopPropagation(); onPrev() }}><ChevronLeft className="size-8" /></button>}
      {item.type === 'video' ? (
        <video src={item.image} controls className="max-w-[90vw] max-h-[90vh] rounded-xl" onClick={e => e.stopPropagation()} />
      ) : (
        <img src={item.image} alt={item.title} className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl" onClick={e => e.stopPropagation()} />
      )}
      {onNext && items.length > 1 && <button className="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost text-white" onClick={(e) => { e.stopPropagation(); onNext() }}><ChevronRight className="size-8" /></button>}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
        {item.title} {items.length > 1 && `(${index + 1}/${items.length})`}
      </div>
    </div>
  )
}
