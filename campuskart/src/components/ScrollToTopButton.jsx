import { useEffect, useState } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'

export function ScrollToTopButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {show ? (
        <Motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className='fixed bottom-24 right-4 z-40 rounded-full bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-xl lg:bottom-6'
        >
          ↑ Top
        </Motion.button>
      ) : null}
    </AnimatePresence>
  )
}
