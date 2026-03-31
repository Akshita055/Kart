import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useAppContext } from '../hooks/useAppContext'

export function ToastContainer() {
  const { toasts } = useAppContext()

  return (
    <div className='fixed right-4 top-20 z-[80] space-y-2'>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${
              toast.type === 'error'
                ? 'bg-rose-500 text-white'
                : 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
            }`}
          >
            {toast.message}
          </Motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
