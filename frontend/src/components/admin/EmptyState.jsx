import { motion } from 'framer-motion'

export default function EmptyState({ icon: Icon, title, description, action, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex flex-col items-center justify-center py-16 text-center ${className}`}
    >
      {Icon && (
        <div className="p-4 rounded-2xl bg-base-200 mb-4">
          <Icon className="size-10 text-base-content/30" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-base-content/60">{title || 'Nothing here yet'}</h3>
      {description && <p className="text-sm text-base-content/40 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  )
}
