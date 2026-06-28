import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AdminLayout from './components/admin/AdminLayout'
import Home from './pages/Home'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage from './pages/PortfolioPage'
import TestimonialsPage from './pages/TestimonialsPage'
import BookingPage from './pages/BookingPage'
import ContactPage from './pages/ContactPage'
import FeedbackPage from './pages/FeedbackPage'
import LoginPage from './pages/LoginPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'))
const AdminPortfolio = lazy(() => import('./pages/admin/AdminPortfolio'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'))
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-base-200">
    <span className="loading loading-spinner loading-lg text-primary" />
  </div>
)

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/testimonials" element={<TestimonialsPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
        <Route path="bookings" element={<Suspense fallback={<AdminFallback />}><AdminBookings /></Suspense>} />
        <Route path="portfolio" element={<Suspense fallback={<AdminFallback />}><AdminPortfolio /></Suspense>} />
        <Route path="services" element={<Suspense fallback={<AdminFallback />}><AdminServices /></Suspense>} />
        <Route path="reviews" element={<Suspense fallback={<AdminFallback />}><AdminReviews /></Suspense>} />
        <Route path="messages" element={<Suspense fallback={<AdminFallback />}><AdminMessages /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}