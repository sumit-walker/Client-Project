import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import { motion } from 'framer-motion'

export default function PublicLayout() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <div className="min-h-screen flex flex-col bg-base-100 overflow-x-hidden max-w-full">
      {!isLogin && <Navbar />}
      <motion.main
        initial={{ opacity: 0, y: isLogin ? 0 : 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="flex-1 overflow-x-hidden max-w-full"
      >
        <Outlet />
      </motion.main>
      {!isLogin && <Footer />}
    </div>
  )
}
