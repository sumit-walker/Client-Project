import { motion } from 'framer-motion'

export default function FormCard({ title, description, children, onSubmit, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden ${className}`}
    >
      {(title || description) && (
        <div className="px-6 pt-6 pb-4 border-b border-base-200">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-base-content/50 mt-1">{description}</p>}
        </div>
      )}
      <form onSubmit={onSubmit} className="p-6 space-y-5">{children}</form>
    </motion.div>
  )
}
