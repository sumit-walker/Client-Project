import { motion } from 'framer-motion'

export default function StatCard({ icon: Icon, label, value, gradient = 'bg-primary', trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden rounded-2xl bg-base-100 border border-base-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.08] ${gradient}`} />
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-base-content/50">{label}</p>
          <motion.p
            key={value}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl font-bold text-base-content tabular-nums"
          >
            {value}
          </motion.p>
          {trend !== undefined && (
            <p className={`text-xs font-medium flex items-center gap-1 ${trend >= 0 ? 'text-success' : 'text-error'}`}>
              <span>{trend >= 0 ? '↑' : '↓'}</span>
              <span>{Math.abs(trend)}% vs last month</span>
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${gradient}/10`}>
          <Icon className={`size-6 ${gradient.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </motion.div>
  )
}
