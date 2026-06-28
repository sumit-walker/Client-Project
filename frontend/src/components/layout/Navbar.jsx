import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, Sun, Moon, User, LogOut, Home, Package, Image, Star, MessageCircle, Phone } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import { SITE } from '../../constants/site'

const navLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/services', label: 'Services', icon: Package },
  { to: '/portfolio', label: 'Portfolio', icon: Image },
  { to: '/testimonials', label: 'Testimonials', icon: Star },
  { to: '/feedback', label: 'Feedback', icon: MessageCircle },
  { to: '/contact', label: 'Contact', icon: Phone },
]


const drawerVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleLogout = () => { logout(); navigate('/') }

  const close = () => setMobileOpen(false)

  return (
    <>
    <header className="sticky top-0 z-40 bg-base-100/80 backdrop-blur-xl border-b border-base-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-display font-bold tracking-tight shrink-0 whitespace-nowrap">
            <span className="text-xl md:text-2xl">
              <span className="text-primary">Mahi</span><span className="text-base-content"> Makeover</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon
              return (
                <NavLink key={link.to} to={link.to} end={link.to === '/'} className={({ isActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'text-primary bg-primary/10' : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'}`
                }>
                  <Icon className="size-4.5 shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              )
            })}
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-circle">
              {theme === 'light' ? <Moon className="size-4.5" /> : <Sun className="size-4.5" />}
            </button>

            {user ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-base-200 cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{user.name?.charAt(0)}</div>
                </label>
                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-lg bg-base-100 rounded-2xl w-48 border border-base-200 mt-2 text-sm">
                  <li className="menu-title"><span>{user.name}</span></li>
                  {user.role === 'admin' && <li><Link to="/admin">Admin Dashboard</Link></li>}
                  <li><button onClick={handleLogout}><LogOut className="size-4" /> Logout</button></li>
                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-sm rounded-full hidden sm:inline-flex">Login</Link>
            )}

            <button onClick={() => setMobileOpen(true)} className="lg:hidden btn btn-ghost btn-sm btn-circle">
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </nav>
    </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="drawer"
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[100] bg-base-100 lg:hidden flex flex-col"
          >
              <div className="flex items-center justify-between px-5 h-16 border-b border-base-200 shrink-0">
                <span className="font-display font-bold text-xl"><span className="text-primary">Mahi</span><span className="text-base-content"> Makeover</span></span>
                <button onClick={close} className="btn btn-ghost btn-sm btn-circle -mr-1" aria-label="Close menu">
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                {navLinks.map(link => {
                  const Icon = link.icon
                  return (
                    <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={close} className={({ isActive }) =>
                      `relative flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${isActive ? 'text-primary bg-primary/10' : 'text-base-content hover:bg-base-200'}`
                    }>
                      <Icon className="size-5 shrink-0" />
                      <span>{link.label}</span>
                    </NavLink>
                  )
                })}
                {user ? (
                  <>
                    <hr className="my-4 border-base-200" />
                    {user.role === 'admin' && (
                      <Link to="/admin" onClick={close} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-base-content/60 hover:text-base-content hover:bg-base-200">
                        <User className="size-4.5" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { handleLogout(); close() }} className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm text-base-content/60 hover:text-error hover:bg-error/5">
                      <LogOut className="size-4.5" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="px-4 pt-4 mt-2 border-t border-base-200">
                    <Link to="/login" onClick={close} className="btn btn-primary btn-block rounded-full text-white">Admin Login</Link>
                  </div>
                )}
              </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}