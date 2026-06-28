import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

export default function DataTable({ columns, data, loading, emptyMessage = 'No data found', page, totalPages, onPageChange }) {
  if (loading) {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-sm">
        <div className="p-6 space-y-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              {columns.map((_, j) => (
                <div key={j} className="skeleton h-9 flex-1 rounded-xl" />
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-base-100 rounded-2xl border border-base-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="border-b border-base-200 bg-base-200/50">
              {columns.map((col, i) => (
                <th key={i} className="text-xs font-semibold uppercase tracking-widest text-base-content/40 py-4 px-5 text-left">{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-20">
                  <div className="flex flex-col items-center gap-2 text-base-content/40">
                    <p className="text-sm font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <motion.tr
                  key={row._id || i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-base-200 hover:bg-base-200/40 transition-colors group"
                >
                  {columns.map((col, j) => (
                    <td key={j} className="py-4 px-5 text-sm text-base-content/80 group-hover:text-base-content transition-colors">
                      {col.render ? col.render(row) : <span>{row[col.key]}</span>}
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex items-center justify-between px-5 py-4 border-t border-base-200 bg-base-200/30">
          <p className="text-xs text-base-content/40">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="btn btn-ghost btn-xs rounded-xl disabled:opacity-30">
              <ChevronLeft className="size-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`btn btn-xs rounded-xl min-w-[2rem] ${page === i + 1 ? 'btn-primary text-white' : 'btn-ghost'}`}
              >
                {i + 1}
              </button>
            ))}
            <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="btn btn-ghost btn-xs rounded-xl disabled:opacity-30">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
