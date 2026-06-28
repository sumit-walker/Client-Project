import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { formatDate, formatCurrency, getStatusBadge } from '../utils/helpers'

export default function MyBookingsPage() {
  const { user, loading: authLoading } = useAuth()
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: () => api.get('/bookings/my').then(r => r.data),
    enabled: !!user,
  })

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg text-primary"></span></div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen py-20 px-4 bg-base-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl mb-8">My Bookings</h1>
        {isLoading ? (
          <div className="flex justify-center py-12"><span className="loading loading-spinner loading-lg text-primary"></span></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 text-base-content/60">
            <Calendar className="size-12 mx-auto mb-4 text-base-content/30" />
            <p className="text-lg">No bookings yet</p>
            <a href="/booking" className="btn btn-primary rounded-full mt-4 text-white">Book Now</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="bg-base-200 p-6 rounded-2xl shadow-sm border border-base-200">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{b.service}</h3>
                    <p className="text-sm text-base-content/60 mt-1">{b.eventDate} at {b.time || 'TBD'} &middot; {b.eventLocation || 'Location TBD'}</p>
                    <div className="flex gap-2 mt-3">
                      <span className={`badge ${getStatusBadge(b.status)} badge-sm capitalize`}>{b.status}</span>
                      <span className="badge badge-ghost badge-sm">{formatCurrency(b.amount)}</span>
                    </div>
                  </div>
                  <div className="text-sm text-base-content/60 text-right">
                    <p>Booked {formatDate(b.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
