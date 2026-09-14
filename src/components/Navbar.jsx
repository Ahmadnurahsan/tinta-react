import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/palette', label: 'Palette Generator' },
  { path: '/about', label: 'About' },
]

export default function Navbar() {
  const location = useLocation()

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-200"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-14">
        <Link to="/" className="text-lg font-light tracking-tight text-neutral-900">
          TINTA.
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm px-4 py-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
