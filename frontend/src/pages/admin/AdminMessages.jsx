import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Trash2, CheckCheck, Reply, ChevronLeft, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SectionHeader from '../../components/admin/SectionHeader'
import EmptyState from '../../components/admin/EmptyState'
import DeleteModal from '../../components/admin/DeleteModal'
import { motion } from 'framer-motion'

export default function AdminMessages() {
  const [selected, setSelected] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/contacts').then(r => r.data),
  })

  const markReplied = useMutation({
    mutationFn: (id) => api.patch(`/contacts/${id}/reply`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-messages'] }); toast.success('Marked as replied') },
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/contacts/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-messages'] }); toast.success('Deleted'); setDeleteTarget(null); if (selected?._id === id) setSelected(null) },
  })

  return (
    <div>
      <SectionHeader title="Messages" description="Customer inquiries" />

      {isLoading ? (
        <div className="grid lg:grid-cols-2 gap-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-36 rounded-2xl" />)}</div>
      ) : messages.length === 0 ? (
        <EmptyState icon={MessageSquare} title="No messages yet" description="Customer inquiries will appear here" />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className={`space-y-3 ${selected ? 'hidden lg:block' : ''}`}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelected(msg)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                  selected?._id === msg._id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-base-200 bg-base-100 hover:border-base-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="size-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{msg.name}</p>
                      {!msg.isReplied ? (
                        <span className="badge badge-warning badge-xs shrink-0">New</span>
                      ) : (
                        <CheckCheck className="size-3 text-success shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-base-content/40">{msg.email}</p>
                    <p className="text-xs text-base-content/50 mt-1.5 line-clamp-2 leading-relaxed">{msg.message}</p>
                    <p className="text-[10px] text-base-content/30 mt-2">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className={`bg-base-100 rounded-2xl border border-base-200 shadow-sm overflow-hidden ${!selected ? 'hidden lg:block' : ''}`}>
            {selected ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <button onClick={() => setSelected(null)} className="btn btn-ghost btn-sm rounded-xl lg:hidden gap-1"><ChevronLeft className="size-4" /> Back</button>
                  <div className="flex gap-1 ml-auto">
                    {!selected.isReplied && (
                      <button onClick={() => markReplied.mutate(selected._id)} className="btn btn-ghost btn-xs text-success" title="Mark Replied"><CheckCheck className="size-3.5" /></button>
                    )}
                    <button onClick={() => setDeleteTarget(selected)} className="btn btn-ghost btn-xs text-error"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-4 mb-5 pb-5 border-b border-base-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent/70 flex items-center justify-center text-white font-semibold shadow-sm">{selected.name?.charAt(0)}</div>
                  <div>
                    <h3 className="font-semibold">{selected.name}</h3>
                    <p className="text-sm text-base-content/50">{selected.email}</p>
                    {selected.phone && <p className="text-sm text-base-content/50">{selected.phone}</p>}
                  </div>
                </div>
                {selected.subject && (
                  <div className="mb-4">
                    <span className="text-xs font-medium text-base-content/70">Subject</span>
                    <p className="text-sm font-medium mt-0.5">{selected.subject}</p>
                  </div>
                )}
                <div>
                  <span className="text-xs font-medium text-base-content/70">Message</span>
                  <p className="text-sm text-base-content/70 leading-relaxed mt-1.5 whitespace-pre-wrap bg-base-200 rounded-xl p-4">{selected.message}</p>
                </div>
                <div className="flex gap-2 mt-6 pt-4 border-t border-base-200">
                  <a href={`mailto:${selected.email}`} className="btn btn-outline btn-sm rounded-xl gap-2 h-9"><Reply className="size-3.5" /> Reply via Email</a>
                  {!selected.isReplied && (
                    <button onClick={() => markReplied.mutate(selected._id)} className="btn btn-primary btn-sm rounded-xl text-white gap-2 h-9"><CheckCheck className="size-3.5" /> Mark Replied</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-base-content/30">
                <MessageSquare className="size-12 mb-3" />
                <p className="text-sm font-medium">Select a message to read</p>
                <p className="text-xs mt-1">Click on a message from the list</p>
              </div>
            )}
          </div>
        </div>
      )}
      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget._id)} title={`Delete message from ${deleteTarget?.name}?`} loading={deleteMutation.isPending} />
    </div>
  )
}
