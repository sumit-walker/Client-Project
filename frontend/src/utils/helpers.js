export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatCurrency = (amt) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amt)
}

export const getStatusBadge = (status) => {
  const map = {
    pending: 'badge-warning',
    approved: 'badge-info',
    completed: 'badge-success',
    cancelled: 'badge-error',
  }
  return map[status] || 'badge-ghost'
}

export const getReviewStatusBadge = (approved) => {
  return approved ? 'badge-success' : 'badge-warning'
}

export const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00']

export const portfolioCategories = ['Bridal', 'Party', 'Engagement', 'HD Makeup', 'Airbrush', 'Fashion']

export const serviceCategories = ['Bridal', 'Party', 'Engagement', 'Reception', 'Haldi', 'Pre Bridal']
