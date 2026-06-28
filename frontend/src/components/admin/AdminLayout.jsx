import { useState, useMemo, useRef, useEffect } from 'react'
import { NavLink, useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../../services/api'
import {
  LayoutDashboard, Image as ImageIcon, Package, CalendarCheck, Star,
  Mail, Settings, LogOut,
  Bell, ChevronDown, ChevronRight, Menu, X, Sun, Moon, PanelLeftClose, PanelLeft, MessageCircle
} from 'lucide-react'

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/portfolio', label: 'Portfolio', icon: ImageIcon },
  { to: '/admin/services', label: 'Services', icon: Package },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/reviews', label: 'Reviews', icon: Star },

  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const { user, loading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)

  const { data: notifBookings = [] } = useQuery({
    queryKey: ['notif-bookings'],
    queryFn: () => api.get('/bookings?status=pending').then(r => r.data),
    refetchInterval: 30000,
  })
  const { data: notifReviews = [] } = useQuery({
    queryKey: ['notif-reviews'],
    queryFn: () => api.get('/reviews?admin=true').then(r => r.data),
    refetchInterval: 30000,
  })
  const { data: notifMessages = [] } = useQuery({
    queryKey: ['notif-messages'],
    queryFn: () => api.get('/contacts').then(r => r.data),
    refetchInterval: 30000,
  })

  const pendingReviews = notifReviews.filter(r => !r.isApproved)
  const unreadMessages = notifMessages.filter(m => !m.isReplied)
  const totalNotifs = notifBookings.length + pendingReviews.length + unreadMessages.length

  useEffect(() => {
    const handleClick = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const currentPage = useMemo(() => {
    const link = sidebarLinks.find(l => l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to))
    return link?.label || 'Dashboard'
  }, [location.pathname])

  const handleLogout = () => { logout(); navigate('/login') }

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-base-200"><span className="loading loading-spinner loading-lg text-primary" /></div>
  if (!user) return <Navigate to="/admin/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  const sidebar = (
    <div className="h-full flex flex-col bg-base-100 border-r border-base-200">
      <div className="p-5 border-b border-base-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm font-display shadow-sm">M</div>
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-sm truncate"><span className="text-primary">Mahi</span> Admin</p>
          <p className="text-[10px] text-base-content/40">Luxury Management</p>
        </div>
        <button onClick={() => setSidebarOpen(false)} className="hidden lg:flex btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-base-content hover:bg-base-200">
          <PanelLeftClose className="size-4" />
        </button>
      </div>

      <div className="px-3 pt-3 pb-2">
        <p className="text-[10px] uppercase tracking-widest text-base-content/30 font-semibold px-3 mb-1">Menu</p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-2 space-y-0.5">
        {sidebarLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.exact}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative
              ${isActive ? 'text-primary bg-primary/10' : 'text-base-content/50 hover:text-base-content hover:bg-base-200/50'}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 rounded-r-full bg-gradient-to-b from-primary to-accent" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <link.icon className="size-4.5 shrink-0" />
                <span className="truncate">{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-base-200 space-y-1">
        <div className="px-3 py-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent/70 flex items-center justify-center text-white text-xs font-bold shadow-sm">{user?.name?.charAt(0)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate text-base-content">{user?.name}</p>
            <p className="text-[10px] text-base-content/40">Administrator</p>
          </div>
        </div>
        <NavLink to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-base-content/40 hover:text-base-content hover:bg-base-200/50 transition-all">
          <PanelLeft className="size-4" /> Back to Site
        </NavLink>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-base-content/40 hover:text-error hover:bg-error/5 transition-all w-full">
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200 flex overflow-x-hidden max-w-full">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="hidden lg:block overflow-hidden shrink-0"
          >
            {sidebar}
          </motion.aside>
        )}
      </AnimatePresence>
      {!sidebarOpen && (
        <button onClick={() => setSidebarOpen(true)} className="hidden lg:flex fixed top-4 left-4 z-50 btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content">
          <PanelLeft className="size-4" />
        </button>
      )}

      <div className={`lg:hidden fixed inset-0 z-50 ${mobileOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${mobileOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setMobileOpen(false)} />
        <motion.aside
          initial={{ x: '-100%' }}
          animate={{ x: mobileOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute left-0 top-0 h-full w-72 max-w-[85vw] shadow-2xl"
        >
          {sidebar}
        </motion.aside>
      </div>

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
          <header className="sticky top-0 z-30 bg-base-100/80 backdrop-blur-xl border-b border-base-200 lg:relative">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16 gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <button onClick={() => setMobileOpen(true)} className="lg:hidden btn btn-ghost btn-circle btn-sm shrink-0">
                <Menu className="size-5" />
              </button>
              {!sidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className="hidden lg:flex btn btn-ghost btn-circle btn-sm text-base-content/40 hover:text-base-content shrink-0">
                  <PanelLeft className="size-4" />
                </button>
              )}
              <span className="sm:hidden font-semibold text-sm truncate text-base-content">{currentPage}</span>
              <div className="hidden sm:flex items-center gap-1.5 text-sm min-w-0">
                <span className="text-base-content/40 shrink-0">Admin</span>
                <ChevronRight className="size-3 text-base-content/20 shrink-0" />
                <span className="font-medium text-base-content truncate">{currentPage}</span>
              </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen(!notifOpen)} className="btn btn-ghost btn-circle btn-sm relative hover:bg-base-200">
                  <Bell className="size-4.5" />
                  {totalNotifs > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-error text-[10px] font-bold text-white flex items-center justify-center px-1 ring-2 ring-base-100">{totalNotifs > 9 ? '9+' : totalNotifs}</span>}
                </button>
                {notifOpen && (
                  <>
                    <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setNotifOpen(false)} aria-hidden="true" />
                    <div className="fixed left-3 right-3 top-[4.25rem] sm:absolute sm:inset-x-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-80 max-w-[calc(100vw-1.5rem)] bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-base-200 flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm truncate">Notifications</span>
                      {totalNotifs > 0 && <span className="badge badge-error badge-xs shrink-0">{totalNotifs} new</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-base-200">
                      {notifBookings.length > 0 && (
                        <Link to="/admin/bookings" onClick={() => setNotifOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
                          <CalendarCheck className="size-4 text-info shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{notifBookings.length} new booking{notifBookings.length > 1 ? 's' : ''}</p>
                            <p className="text-xs text-base-content/40 truncate">Pending approval</p>
                          </div>
                        </Link>
                      )}
                      {pendingReviews.length > 0 && (
                        <Link to="/admin/reviews" onClick={() => setNotifOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
                          <MessageCircle className="size-4 text-warning shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{pendingReviews.length} pending review{pendingReviews.length > 1 ? 's' : ''}</p>
                            <p className="text-xs text-base-content/40 truncate">Awaiting approval</p>
                          </div>
                        </Link>
                      )}
                      {unreadMessages.length > 0 && (
                        <Link to="/admin/messages" onClick={() => setNotifOpen(false)} className="flex items-start gap-3 px-4 py-3 hover:bg-base-200/50 transition-colors">
                          <Mail className="size-4 text-cyan-500 shrink-0 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium">{unreadMessages.length} unread message{unreadMessages.length > 1 ? 's' : ''}</p>
                            <p className="text-xs text-base-content/40 truncate">From contact form</p>
                          </div>
                        </Link>
                      )}
                      {totalNotifs === 0 && (
                        <div className="px-4 py-8 text-center text-base-content/30">
                          <Bell className="size-6 mx-auto mb-2" />
                          <p className="text-xs font-medium">All clear</p>
                        </div>
                      )}
                    </div>
                    <Link to="/admin/bookings" onClick={() => setNotifOpen(false)} className="block px-4 py-2.5 text-center text-xs text-primary font-medium border-t border-base-200 hover:bg-base-200/50 transition-colors">View all</Link>
                    </div>
                  </>
                )}
              </div>
              <button onClick={toggleTheme} className="btn btn-ghost btn-circle btn-sm hover:bg-base-200">
                {theme === 'light' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
              </button>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-base-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent/70 flex items-center justify-center text-white text-xs font-bold shadow-sm">{user?.name?.charAt(0)}</div>
                  <ChevronDown className="size-3 text-base-content/40 hidden sm:block" />
                </label>
                <div tabIndex={0} className="dropdown-content z-50 mt-2 w-52 bg-base-100 rounded-2xl shadow-2xl border border-base-200 overflow-hidden p-2">
                  <div className="px-3 py-2.5 mb-1 border-b border-base-200">
                    <p className="text-sm font-semibold text-base-content truncate">{user?.name}</p>
                    <p className="text-xs text-base-content/50 mt-0.5">Administrator</p>
                  </div>
                  <NavLink
                    to="/"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-base-content/70 hover:text-base-content hover:bg-base-200/60 transition-colors"
                  >
                    Back to Site
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm text-base-content/70 hover:text-error hover:bg-error/5 transition-colors"
                  >
                    <LogOut className="size-4 shrink-0" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 w-full max-w-full min-w-0 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
