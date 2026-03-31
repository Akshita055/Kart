import { motion as Motion } from 'framer-motion'
import { cn } from '../utils/cn'

const variants = {
  primary:
    'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl',
  secondary:
    'bg-white/70 text-slate-800 dark:bg-slate-800/80 dark:text-slate-100 border border-slate-200/70 dark:border-slate-700',
  ghost:
    'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800',
}

export function Button({ className, variant = 'primary', children, ...props }) {
  return (
    <Motion.button
      whileTap={{ scale: 0.96 }}
      whileHover={{ y: -1 }}
      className={cn(
        'rounded-2xl px-5 py-3 text-sm font-semibold transition-all duration-300',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </Motion.button>
  )
}
