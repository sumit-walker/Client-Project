import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { CalendarCheck, Image as ImageIcon, Star, Mail, DollarSign, TrendingUp, Clock, MessageSquare, MessageCircle } from 'lucide-react'
import api from '../../services/api'
import StatCard from '../../components/admin/StatCard'
import SectionHeader from '../../components/admin/SectionHeader'

export default function AdminDashboard() {
  const { data: bStats } = useQuery({ queryKey: ['booking-stats'], queryFn: () => api.get('/bookings/stats').then(r => r.data) })
  const { data: rStats } = useQuery({ queryKey: ['review-stats'], queryFn: () => api.get('/reviews/stats').then(r => r.data) })
  const { data: portfolio = [] } = useQuery({ queryKey: ['admin-portfolio'], queryFn: () => api.get('/portfolio').then(r => r.data) })
  const { data: messages = [] } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/contacts').then(r => r.data) })

  const cards = [
    { icon: CalendarCheck, label: 'Total Bookings', value: bStats?.total || 0, gradient: 'bg-violet-500', trend: bStats?.total ? 12 : undefined },
    { icon: Clock, label: "Today's Appointments", value: bStats?.todayCount || 0, gradient: 'bg-blue-500', trend: bStats?.todayCount ? 8 : undefined },
    { icon: MessageCircle, label: 'Pending Reviews', value: rStats?.pending || 0, gradient: 'bg-emerald-500', trend: (rStats?.pending || 0) > 0 ? 100 : undefined },
    { icon: ImageIcon, label: 'Portfolio Images', value: portfolio.length, gradient: 'bg-amber-500', trend: portfolio.length ? 3 : undefined },
    { icon: Star, label: 'Reviews', value: rStats?.total || 0, gradient: 'bg-rose-500', trend: rStats?.total ? -2 : undefined },
    { icon: Mail, label: 'Unread Messages', value: messages.filter(m => !m.isReplied).length, gradient: 'bg-cyan-500', trend: 0 },
    { icon: DollarSign, label: 'Revenue', value: `₹${(bStats?.revenue || 0).toLocaleString()}`, gradient: 'bg-primary' },
    { icon: TrendingUp, label: 'Avg Rating', value: rStats?.avgRating ? rStats.avgRating.toFixed(1) : '0', gradient: 'bg-yellow-500' },
  ]

  return (
    <div>
      <SectionHeader title="Dashboard" description="Your business at a glance" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <CalendarCheck className="size-5 text-violet-500" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Booking Status</h3>
              <p className="text-xs text-base-content/50">Current distribution</p>
            </div>
          </div>
          <div className="space-y-5">
            {[
              { label: 'Pending', value: bStats?.pending || 0, color: 'bg-warning', pct: bStats?.total ? ((bStats.pending / bStats.total) * 100).toFixed(0) : 0 },
              { label: 'Approved', value: bStats?.approved || 0, color: 'bg-info', pct: bStats?.total ? ((bStats.approved / bStats.total) * 100).toFixed(0) : 0 },
              { label: 'Completed', value: bStats?.completed || 0, color: 'bg-success', pct: bStats?.total ? ((bStats.completed / bStats.total) * 100).toFixed(0) : 0 },
              { label: 'Cancelled', value: bStats?.cancelled || 0, color: 'bg-error', pct: bStats?.total ? ((bStats.cancelled / bStats.total) * 100).toFixed(0) : 0 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-base-content/70">{item.label}</span>
                  <span className="font-semibold text-base-content">{item.value}</span>
                </div>
                <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.pct}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-base-100 rounded-2xl border border-base-200 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-base-200">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <MessageSquare className="size-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Recent Messages</h3>
              <p className="text-xs text-base-content/50">Latest inquiries</p>
            </div>
          </div>
          <div className="space-y-4">
            {messages.slice(0, 4).map((msg) => (
              <div key={msg._id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-base-200/50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{msg.name}</p>
                    {!msg.isReplied && <span className="badge badge-warning badge-xs shrink-0">New</span>}
                  </div>
                  <p className="text-xs text-base-content/40 truncate mt-0.5">{msg.message?.slice(0, 60)}</p>
                </div>
                <span className="text-[10px] text-base-content/30 shrink-0 mt-0.5">{new Date(msg.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center py-8 text-base-content/30">
                <Mail className="size-8 mx-auto mb-2" />
                <p className="text-xs font-medium">No messages yet</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
