import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Search, Trash2, Ban, CheckCircle, Users as UsersIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../services/api'
import SectionHeader from '../../components/admin/SectionHeader'
import DataTable from '../../components/admin/DataTable'
import DeleteModal from '../../components/admin/DeleteModal'
import EmptyState from '../../components/admin/EmptyState'

export default function AdminUsers() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => api.get(`/users?search=${search}`).then(r => r.data),
  })

  const toggleBlock = useMutation({
    mutationFn: (id) => api.patch(`/users/${id}/block`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Updated') },
  })
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/users/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Deleted'); setDeleteTarget(null) },
  })

  const perPage = 10
  const totalPages = Math.ceil(users.length / perPage)
  const paginated = users.slice((page - 1) * perPage, page * perPage)

  const columns = [
    { header: 'User', render: (u) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-accent/70 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm">{u.name?.charAt(0)}</div>
          <div><p className="font-medium text-sm">{u.name}</p><p className="text-xs text-base-content/40">{u.email}</p></div>
        </div>
      ),
    },
    { header: 'Phone', render: (u) => <span className="text-sm text-base-content/60">{u.phone || '-'}</span> },
    { header: 'Role', render: (u) => <span className={`badge badge-sm ${u.role === 'admin' ? 'badge-primary' : 'badge-ghost'}`}>{u.role}</span> },
    { header: 'Status', render: (u) => u.isBlocked ? <span className="badge badge-error badge-sm">Blocked</span> : <span className="badge badge-success badge-sm">Active</span> },
    { header: 'Joined', render: (u) => <span className="text-xs text-base-content/50">{new Date(u.createdAt).toLocaleDateString()}</span> },
    { header: '', render: (u) => (
        <div className="flex gap-1 justify-end">
          <button onClick={() => toggleBlock.mutate(u._id)} className="btn btn-ghost btn-xs" title={u.isBlocked ? 'Unblock' : 'Block'}>
            {u.isBlocked ? <CheckCircle className="size-3.5 text-success" /> : <Ban className="size-3.5 text-warning" />}
          </button>
          <button onClick={() => setDeleteTarget(u)} className="btn btn-ghost btn-xs text-error"><Trash2 className="size-3.5" /></button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <SectionHeader title="Users" description="Manage registered users" />
      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/30" />
        <input
          type="text"
          placeholder="Search users..."
          className="input input-sm input-bordered rounded-xl pl-9 w-full text-sm bg-base-100 border-base-300 focus:border-primary transition-all"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
      </div>
      {users.length === 0 && !isLoading ? (
        <EmptyState icon={UsersIcon} title="No users found" description={search ? 'Try a different search' : 'No users have registered yet'} />
      ) : (
        <DataTable columns={columns} data={paginated} loading={isLoading} page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
      <DeleteModal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteMutation.mutate(deleteTarget._id)} title={`Delete ${deleteTarget?.name}?`} loading={deleteMutation.isPending} />
    </div>
  )
}
