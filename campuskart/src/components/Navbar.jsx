import { Link, NavLink } from 'react-router-dom'
import { motion as Motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppContext } from '../hooks/useAppContext'

export function Navbar({ theme, toggleTheme }) {
  const {
    searchQuery,
    setSearchQuery,
    user,
    isAuthenticated,
    signOut,
    addToast,
    cartCount,
    wishlistCount,
    notifications,
    markNotificationRead,
    loadNotifications,
  } = useAppContext()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const profileMenuRef = useRef(null)
  const notificationRef = useRef(null)

  const initials = useMemo(() => {
    if (!user?.name) return 'AR'
    const parts = user.name.split(' ').filter(Boolean)
    return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'AR'
  }, [user])

  useEffect(() => {
    const handleOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadNotifications()
    }
  }, [isAuthenticated, loadNotifications])

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
              { to: '/', label: 'Explore' },
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

          <Link
            to='/wishlist'
            className='relative grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-white text-base text-slate-700 transition hover:scale-105 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            aria-label='Wishlist'
          >
            ♡
            {wishlistCount > 0 ? (
              <span className='absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-cyan-500 px-1 text-[10px] font-bold text-white'>
                {wishlistCount}
              </span>
            ) : null}
          </Link>

          <Link
            to='/cart'
            className='relative grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-white text-base text-slate-700 transition hover:scale-105 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
            aria-label='Cart'
          >
            🛒
            {cartCount > 0 ? (
              <span className='absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white'>
                {cartCount}
              </span>
            ) : null}
          </Link>

          <div className='relative' ref={notificationRef}>
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className='relative grid h-10 w-10 place-items-center rounded-2xl border border-slate-200/70 bg-white text-base text-slate-700 transition hover:scale-105 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
              aria-label='Notifications'
            >
              🔔
              {notifications.some((item) => !item.read) ? (
                <span className='absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white'>
                  {notifications.filter((item) => !item.read).length}
                </span>
              ) : null}
            </button>

            {showNotifications ? (
              <div className='absolute right-0 top-12 z-50 max-h-80 w-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900'>
                <p className='px-2 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
                  Notifications
                </p>
                {notifications.length ? (
                  notifications.slice(0, 10).map((item) => (
                    <button
                      key={item._id}
                      onClick={() => markNotificationRead(item._id)}
                      className={`mt-1 block w-full rounded-xl px-3 py-2 text-left text-xs transition ${
                        item.read
                          ? 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                          : 'bg-indigo-50 text-slate-700 hover:bg-indigo-100 dark:bg-indigo-500/20 dark:text-slate-200 dark:hover:bg-indigo-500/30'
                      }`}
                    >
                      <p className='font-semibold'>{item.title}</p>
                      <p className='truncate'>{item.body}</p>
                    </button>
                  ))
                ) : (
                  <p className='px-3 py-2 text-xs text-slate-500 dark:text-slate-400'>No notifications</p>
                )}
              </div>
            ) : null}
          </div>

          {isAuthenticated ? (
            <div className='relative' ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen((prev) => !prev)}
                className='grid h-10 w-10 place-items-center rounded-full border-2 border-indigo-300 bg-linear-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-lg shadow-indigo-500/25'
                aria-label='Open profile menu'
              >
                {user?.photoUrl ? (
                  <img src={user.photoUrl} alt='Profile' className='h-full w-full rounded-full object-cover' />
                ) : (
                  initials
                )}
              </button>

              {isProfileMenuOpen ? (
                <div className='absolute right-0 top-12 z-50 w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-slate-700 dark:bg-slate-900'>
                  <Link
                    to='/profile/edit'
                    onClick={() => {
                      setIsProfileMenuOpen(false)
                    }}
                    className='block w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      addToast('Signed out')
                      setIsProfileMenuOpen(false)
                    }}
                    className='mt-1 w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-900/20'
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
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
