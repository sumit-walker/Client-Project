import { motion } from 'framer-motion'

export default function SectionHeader({ title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-start justify-between gap-4 mb-8"
    >
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-base-content tracking-tight">{title}</h1>
        {description && <p className="text-sm text-base-content/50">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  )
}
