import { NavLink } from 'react-router-dom'
import { useAppContext } from '../hooks/useAppContext'

const links = [
  { to: '/', label: 'Home', icon: '⌂' },
  { to: '/chat', label: 'Messages', icon: '◉' },
  { to: '/add-product', label: 'Post Item', icon: '+' },
  { to: '/profile', label: 'Profile', icon: '☺' },
  { to: '/settings', label: 'Settings', icon: '⚙' },
]

export function Sidebar() {
  const { user, isAuthenticated } = useAppContext()

  return (
    <aside className='sticky top-24 hidden h-fit w-64 rounded-3xl border border-white/20 bg-white/65 p-4 backdrop-blur-xl lg:block dark:border-slate-700/30 dark:bg-slate-900/70'>
      <div className='mb-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 p-4 text-white'>
        <p className='text-lg font-bold'>{isAuthenticated ? user?.name : 'Guest User'}</p>
        <p className='text-xs text-white/80'>{isAuthenticated ? 'Verified Student' : 'Sign in to post items'}</p>
      </div>
      <nav className='space-y-1'>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/70'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
