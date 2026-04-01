import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Feed', icon: '⌂' },
  { to: '/wishlist', label: 'Wishlist', icon: '♡' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/chat', label: 'Chat', icon: '◉' },
  { to: '/profile', label: 'Profile', icon: '☺' },
]

export function BottomNav() {
  return (
    <nav className='fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-slate-200/80 bg-white/85 px-4 py-3 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-950/85 lg:hidden'>
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 rounded-xl px-2 py-1 text-[11px] font-semibold transition ${
              isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-slate-400 dark:text-slate-500'
            }`
          }
        >
          <span className='text-base'>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
