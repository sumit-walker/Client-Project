import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, CheckCircle, XCircle, Filter, Eye, X, MapPin, FileText, Phone, Mail, Calendar, Clock, DollarSign, Tag } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import api from '../../services/api'
import { formatCurrency } from '../../utils/helpers'
import SectionHeader from '../../components/admin/SectionHeader'
import DataTable from '../../components/admin/DataTable'
import DeleteModal from '../../components/admin/DeleteModal'
import EmptyState from '../../components/admin/EmptyState'

const statusColors = {
  pending: 'badge-warning',
  approved: 'badge-info',
  completed: 'badge-success',
  cancelled: 'badge-error',
}

export default function AdminBookings() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [viewTarget, setViewTarget] = useState(null)
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['admin-bookings', filter, search],
    queryFn: () => api.get(`/bookings?status=${filter}&search=${search}`).then(r => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/bookings/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }); queryClient.invalidateQueries({ queryKey: ['booking-stats'] }); toast.success('Updated') },
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/bookings/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-bookings'] }); toast.success('Deleted'); setDeleteTarget(null) },
  })

  const perPage = 10
  const totalPages = Math.ceil(bookings.length / perPage)
  const paginated = bookings.slice((page - 1) * perPage, page * perPage)

  const columns = [
    { header: 'Customer', render: (b) => (
      <div className="flex items-center gap-3 min-w-[180px]">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">{b.name?.charAt(0)}</div>
        <div className="min-w-0">
          <p className="font-medium text-sm truncate">{b.name}</p>
          <p className="text-xs text-base-content/40 truncate">{b.email}</p>
          <p className="text-xs text-base-content/30 truncate">{b.phone}</p>
        </div>
      </div>
    )},
    { header: 'Service', render: (b) => <span className="text-sm font-medium block max-w-[12rem] truncate">{b.service}</span> },
    { header: 'Date', render: (b) => <span className="text-sm whitespace-nowrap">{b.eventDate}</span> },
    { header: 'Time', render: (b) => <span className="text-sm text-base-content/60">{b.time || '-'}</span> },
    { header: 'Location', render: (b) => <span className="text-sm text-base-content/60 block min-w-[14rem] whitespace-normal break-words">{b.eventLocation || '-'}</span> },
    { header: 'Notes', render: (b) => <span className="text-sm text-base-content/50 block min-w-[12rem] whitespace-normal break-words">{b.notes || '-'}</span> },
    { header: 'Amount', render: (b) => <span className="font-semibold text-sm whitespace-nowrap">{formatCurrency(b.amount)}</span> },
    { header: 'Status', render: (b) => <span className={`badge ${statusColors[b.status]} badge-sm capitalize whitespace-nowrap`}>{b.status}</span> },
    { header: '', render: (b) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => setViewTarget(b)} className="btn btn-ghost btn-xs text-base-content/50 hover:text-primary" title="View Details"><Eye className="size-3.5" /></button>
          {b.status === 'pending' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'approved' } })} className="btn btn-ghost btn-xs text-success" title="Approve"><CheckCircle className="size-3.5" /></button>}
          {b.status === 'pending' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'cancelled' } })} className="btn btn-ghost btn-xs text-error" title="Reject"><XCircle className="size-3.5" /></button>}
          {b.status === 'approved' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'completed' } })} className="btn btn-ghost btn-xs text-success" title="Complete"><CheckCircle className="size-3.5" /></button>}
          <button onClick={() => setDeleteTarget(b)} className="btn btn-ghost btn-xs text-error" title="Delete"><Trash2 className="size-3.5" /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <SectionHeader title="Bookings" description="Manage all client bookings" />

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
          <input
            type="text"
            placeholder="Search by name, email, service..."
            className="input input-sm input-bordered rounded-xl pl-9 w-full text-sm bg-base-100 border-base-300 focus:border-primary transition-all"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select
          className="select select-sm select-bordered rounded-xl text-sm bg-base-100 border-base-300 w-full sm:w-40"
          value={filter}
          onChange={e => { setFilter(e.target.value); setPage(1) }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {bookings.length === 0 && !isLoading ? (
        <EmptyState icon={Filter} title="No bookings found" description={search ? 'Try a different search' : 'No bookings have been made yet'} />
      ) : (
        <>
          <div className="hidden lg:block">
            <DataTable columns={columns} data={paginated} loading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
          <div className="lg:hidden space-y-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-base-100 rounded-2xl border border-base-200 p-5 space-y-3">
                  <div className="skeleton h-5 w-40 rounded-lg" />
                  <div className="skeleton h-4 w-60 rounded-lg" />
                  <div className="skeleton h-4 w-32 rounded-lg" />
                </div>
              ))
            ) : (
              paginated.map((b) => (
                <div key={b._id} className="bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-4 pb-3 border-b border-base-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{b.name?.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-sm">{b.name}</p>
                        <span className={`badge ${statusColors[b.status]} badge-xs capitalize`}>{b.status}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-primary">{formatCurrency(b.amount)}</span>
                  </div>
                  <div className="p-4 space-y-2.5 text-sm">
                    <div className="flex items-center gap-2 text-base-content/60"><Mail className="size-3.5 shrink-0" /><span className="truncate">{b.email}</span></div>
                    <div className="flex items-center gap-2 text-base-content/60"><Phone className="size-3.5 shrink-0" /><span>{b.phone}</span></div>
                    <div className="flex items-center gap-2 text-base-content/60"><Tag className="size-3.5 shrink-0" /><span className="truncate">{b.service}</span></div>
                    <div className="flex items-center gap-2 text-base-content/60"><Calendar className="size-3.5 shrink-0" /><span>{b.eventDate}{b.time ? ` at ${b.time}` : ''}</span></div>
                    {b.eventLocation && <div className="flex items-start gap-2 text-base-content/60"><MapPin className="size-3.5 shrink-0 mt-0.5" /><span className="break-words">{b.eventLocation}</span></div>}
                    {b.notes && <div className="flex items-start gap-2 text-base-content/50"><FileText className="size-3.5 shrink-0 mt-0.5" /><span className="break-words">{b.notes}</span></div>}
                  </div>
                  <div className="flex gap-2 px-4 pb-4">
                    <button onClick={() => setViewTarget(b)} className="btn btn-ghost btn-xs rounded-xl flex-1"><Eye className="size-3.5" /> View</button>
                    {b.status === 'pending' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'approved' } })} className="btn btn-success btn-xs rounded-xl flex-1 text-white"><CheckCircle className="size-3.5" /> Approve</button>}
                    {b.status === 'pending' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'cancelled' } })} className="btn btn-error btn-xs rounded-xl flex-1 text-white"><XCircle className="size-3.5" /> Reject</button>}
                    {b.status === 'approved' && <button onClick={() => updateMutation.mutate({ id: b._id, data: { status: 'completed' } })} className="btn btn-success btn-xs rounded-xl flex-1 text-white"><CheckCircle className="size-3.5" /> Complete</button>}
                    <button onClick={() => setDeleteTarget(b)} className="btn btn-ghost btn-xs rounded-xl text-error"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              ))
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 pt-2">
                <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="btn btn-outline btn-sm rounded-xl">Prev</button>
                <span className="flex items-center text-xs text-base-content/50">Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="btn btn-outline btn-sm rounded-xl">Next</button>
              </div>
            )}
          </div>
        </>
      )}

      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget._id)} title={`Delete booking by ${deleteTarget?.name}?`} loading={deleteMutation.isPending} />

      <AnimatePresence>
        {viewTarget && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setViewTarget(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-base-100 rounded-2xl shadow-2xl border border-base-200 w-full max-w-lg max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 sticky top-0 bg-base-100 z-10">
                <h3 className="font-semibold text-lg">Booking Details</h3>
                <button onClick={() => setViewTarget(null)} className="btn btn-ghost btn-sm btn-circle"><X className="size-4" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4 pb-4 border-b border-base-200">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">{viewTarget.name?.charAt(0)}</div>
                  <div>
                    <p className="font-semibold text-lg">{viewTarget.name}</p>
                    <span className={`badge ${statusColors[viewTarget.status]} badge-sm capitalize mt-1`}>{viewTarget.status}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <DetailRow icon={Mail} label="Email" value={viewTarget.email} />
                  <DetailRow icon={Phone} label="Phone" value={viewTarget.phone} />
                  <DetailRow icon={Tag} label="Service" value={viewTarget.service} />
                  <DetailRow icon={DollarSign} label="Amount" value={formatCurrency(viewTarget.amount)} />
                  <DetailRow icon={Calendar} label="Date" value={viewTarget.eventDate} />
                  <DetailRow icon={Clock} label="Time" value={viewTarget.time || '-'} />
                </div>

                <div className="space-y-3 pt-2 border-t border-base-200">
                  <DetailRow icon={MapPin} label="Location" value={viewTarget.eventLocation || '-'} full />
                  <DetailRow icon={FileText} label="Notes" value={viewTarget.notes || '-'} full />
                </div>

                <div className="flex gap-2 pt-2 border-t border-base-200">
                  {viewTarget.status === 'pending' && (
                    <>
                      <button onClick={() => { updateMutation.mutate({ id: viewTarget._id, data: { status: 'approved' } }); setViewTarget(null) }} className="btn btn-success btn-sm rounded-xl flex-1 text-white"><CheckCircle className="size-4" /> Approve</button>
                      <button onClick={() => { updateMutation.mutate({ id: viewTarget._id, data: { status: 'cancelled' } }); setViewTarget(null) }} className="btn btn-error btn-sm rounded-xl flex-1 text-white"><XCircle className="size-4" /> Reject</button>
                    </>
                  )}
                  {viewTarget.status === 'approved' && (
                    <button onClick={() => { updateMutation.mutate({ id: viewTarget._id, data: { status: 'completed' } }); setViewTarget(null) }} className="btn btn-success btn-sm rounded-xl flex-1 text-white"><CheckCircle className="size-4" /> Mark Completed</button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DetailRow({ icon: Icon, label, value, full }) {
  return (
    <div className={`flex items-start gap-3 ${full ? 'col-span-2' : ''}`}>
      <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="size-4 text-primary/70" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-base-content/40 font-medium">{label}</p>
        <p className="text-sm text-base-content mt-0.5 break-words">{value}</p>
      </div>
    </div>
  )
}
