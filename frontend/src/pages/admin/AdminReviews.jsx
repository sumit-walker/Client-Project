import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, ThumbsUp, Trash2, Pencil, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SectionHeader from '../../components/admin/SectionHeader'
import DeleteModal from '../../components/admin/DeleteModal'
import EmptyState from '../../components/admin/EmptyState'
import { motion } from 'framer-motion'

export default function AdminReviews() {
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [editing, setEditing] = useState(null)
  const [editText, setEditText] = useState('')
  const queryClient = useQueryClient()

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['admin-reviews'],
    queryFn: () => api.get('/reviews?admin=true').then(r => r.data),
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
    queryClient.invalidateQueries({ queryKey: ['reviews'] })
    queryClient.invalidateQueries({ queryKey: ['notif-reviews'] })
  }

  const toggleApprovalMutation = useMutation({
    mutationFn: ({ id, isApproved }) => api.put(`/reviews/${id}`, { isApproved }),
    onMutate: async ({ id, isApproved }) => {
      await queryClient.cancelQueries({ queryKey: ['admin-reviews'] })
      const previous = queryClient.getQueryData(['admin-reviews'])
      queryClient.setQueryData(['admin-reviews'], (old = []) =>
        old.map((r) => (r._id === id ? { ...r, isApproved } : r)),
      )
      return { previous }
    },
    onSuccess: (_, { isApproved }) => {
      invalidate()
      toast.success(isApproved ? 'Review approved' : 'Review hidden — moved to pending')
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(['admin-reviews'], context.previous)
      toast.error('Something went wrong. Try again.')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/reviews/${id}`),
    onSuccess: () => { invalidate(); toast.success('Deleted'); setDeleteTarget(null) },
    onError: () => toast.error('Something went wrong. Try again.'),
  })

  const saveEditMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/reviews/${id}`, data),
    onSuccess: () => { invalidate(); toast.success('Updated'); setEditing(null) },
    onError: () => toast.error('Something went wrong. Try again.'),
  })

  const startEdit = (r) => { setEditing(r._id); setEditText(r.text) }

  const isApproved = (r) => r.isApproved === true

  return (
    <div>
      <SectionHeader title="Reviews" description="Manage customer feedback" />
      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-32 rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState icon={Star} title="No reviews yet" description="Customer reviews will appear here once submitted" />
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-base-100 rounded-2xl border border-base-200 p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {r.image && r.image !== '' ? (
                  <div className="avatar shrink-0">
                    <div className="w-12 rounded-full ring-2 ring-primary/20">
                      <img src={r.image} alt={r.name} />
                    </div>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full ring-2 ring-primary/20 bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {r.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold text-sm">{r.name}</h4>
                    <span className={`badge badge-xs ${isApproved(r) ? 'badge-success' : 'badge-warning'}`}>
                      {isApproved(r) ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className={`size-3.5 ${s < r.rating ? 'fill-current' : 'opacity-30'}`} />
                    ))}
                  </div>
                  {editing === r._id ? (
                    <div className="flex gap-2">
                      <textarea
                        className="textarea textarea-bordered textarea-sm rounded-xl flex-1 text-sm bg-base-100 border-base-300 focus:border-primary transition-all"
                        rows="2"
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                      />
                      <div className="flex flex-col gap-1">
                        <button onClick={() => saveEditMutation.mutate({ id: r._id, data: { text: editText } })} className="btn btn-primary btn-xs rounded-xl text-white"><Check className="size-3" /></button>
                        <button onClick={() => setEditing(null)} className="btn btn-ghost btn-xs rounded-xl"><X className="size-3" /></button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-base-content/60 italic leading-relaxed">"{r.text}"</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex gap-0.5">
                    {!isApproved(r) && (
                      <button
                        type="button"
                        onClick={() => toggleApprovalMutation.mutate({ id: r._id, isApproved: true })}
                        className="btn btn-ghost btn-xs rounded-lg gap-1 px-2 text-success hover:text-success"
                        disabled={toggleApprovalMutation.isPending}
                        title="Approve review"
                      >
                        <ThumbsUp className="size-3.5" />
                      </button>
                    )}
                    <button type="button" onClick={() => startEdit(r)} className="btn btn-ghost btn-xs rounded-lg px-2 text-base-content/50 hover:text-base-content" title="Edit"><Pencil className="size-3.5" /></button>
                    <button type="button" onClick={() => setDeleteTarget(r)} className="btn btn-ghost btn-xs rounded-lg px-2 text-base-content/50 hover:text-error" title="Delete"><Trash2 className="size-3.5" /></button>
                  </div>
                  {!isApproved(r) && (
                    <button
                      type="button"
                      onClick={() => toggleApprovalMutation.mutate({ id: r._id, isApproved: true })}
                      className="btn btn-ghost btn-xs rounded-lg px-3 h-8 min-h-8 text-xs font-medium text-base-content/70 hover:text-success border border-base-300/70"
                      disabled={toggleApprovalMutation.isPending}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget._id)} title={`Delete review by ${deleteTarget?.name}?`} loading={deleteMutation.isPending} />
    </div>
  )
}
