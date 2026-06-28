import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X } from 'lucide-react'

export default function DeleteModal({ open, onClose, onConfirm, title = 'Delete item?', description = 'This action cannot be undone.', loading }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-base-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-base-200"
          >
            <button onClick={onClose} className="absolute top-4 right-4 btn btn-ghost btn-circle btn-sm"><X className="size-4" /></button>
            <div className="flex flex-col items-center text-center gap-3 py-4">
              <div className="p-3 rounded-full bg-error/10"><AlertTriangle className="size-8 text-error" /></div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm text-base-content/50">{description}</p>
              <div className="flex gap-3 mt-2 w-full">
                <button onClick={onClose} className="btn btn-outline flex-1 rounded-xl">Cancel</button>
                <button onClick={onConfirm} className="btn btn-error flex-1 rounded-xl text-white" disabled={loading}>
                  {loading ? <span className="loading loading-spinner loading-sm" /> : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
