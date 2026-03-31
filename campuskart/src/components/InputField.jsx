import { cn } from '../utils/cn'

export function InputField({ label, className, error, ...props }) {
  return (
    <label className='block space-y-2'>
      {label ? (
        <span className='text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400'>
          {label}
        </span>
      ) : null}
      <input
        className={cn(
          'w-full rounded-2xl border border-transparent bg-white/70 px-4 py-3 text-sm text-slate-800 outline-none ring-0 transition-all placeholder:text-slate-400 focus:border-indigo-400 dark:bg-slate-900/70 dark:text-slate-100 dark:focus:border-indigo-500',
          error && 'border-rose-400 bg-rose-50/80 dark:bg-rose-950/30',
          className,
        )}
        {...props}
      />
      {error ? <span className='text-xs text-rose-500'>{error}</span> : null}
    </label>
  )
}
