import { AnimatePresence, motion as Motion } from 'framer-motion'

export function Modal({ open, title, children, onClose }) {
  return (
    <AnimatePresence>
      {open ? (
        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 z-[70] grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm'
          onClick={onClose}
        >
          <Motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className='w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='mb-3 flex items-center justify-between'>
              <h3 className='text-lg font-bold text-slate-900 dark:text-slate-100'>{title}</h3>
              <button
                onClick={onClose}
                className='rounded-xl bg-slate-100 px-3 py-1 text-sm dark:bg-slate-800'
              >
                Close
              </button>
            </div>
            {children}
          </Motion.div>
        </Motion.div>
      ) : null}
    </AnimatePresence>
  )
}
