import { Link, NavLink } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useMemo } from 'react'
import { useAppContext } from '../hooks/useAppContext'

export function Navbar({ theme, toggleTheme }) {
  const { searchQuery, setSearchQuery, user, isAuthenticated, signOut, addToast } = useAppContext()

  const initials = useMemo(() => {
    if (!user?.name) return 'AR'
    const parts = user.name.split(' ').filter(Boolean)
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AR'
  }, [user])

  return (
    <Motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className='sticky top-0 z-50 border-b border-white/40 bg-white/72 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur-xl transition-colors dark:border-slate-700/30 dark:bg-slate-950/70'
    >
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6'>
        <div className='flex items-center gap-6'>
          <Link to='/' className='group flex items-center gap-2.5'>
            <span className='grid h-8 w-8 place-items-center rounded-xl bg-linear-to-br from-indigo-600 to-cyan-500 text-xs font-black text-white shadow-lg shadow-indigo-500/35'>
              CK
            </span>
            <span className='text-xl font-extrabold tracking-tight text-indigo-700 transition group-hover:text-indigo-600 dark:text-indigo-300 dark:group-hover:text-indigo-200'>
              CampusKart
            </span>
          </Link>
          <nav className='hidden items-center gap-5 md:flex'>
            {[
              { to: '/', label: 'Feed' },
              { to: '/product/p2', label: 'Explore' },
              { to: '/chat', label: 'Chat' },
              { to: '/profile', label: 'Profile' },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-indigo-300'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className='flex flex-1 items-center justify-end gap-2 sm:gap-3'>
          <div className='hidden w-full max-w-md items-center gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 px-3 py-2 dark:border-slate-700/80 dark:bg-slate-800/80 md:flex'>
            <span className='text-slate-400'>⌕</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className='w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400'
              placeholder='Search textbooks, tech, furniture...'
            />
          </div>
          <button
            aria-label='Toggle theme'
            onClick={toggleTheme}
            className='rounded-2xl border border-slate-200/70 bg-slate-100 p-2.5 text-lg transition hover:scale-105 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800'
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  signOut()
                  addToast('Signed out')
                }}
                className='hidden rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 sm:block'
              >
                Logout
              </button>
              <Link
                to='/profile'
                className='grid h-10 w-10 place-items-center rounded-full border-2 border-indigo-300 bg-linear-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/25'
              >
                {initials}
              </Link>
            </>
          ) : (
            <Link
              to='/auth'
              className='rounded-2xl bg-linear-to-r from-indigo-600 to-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:brightness-105'
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </Motion.header>
  )
}
