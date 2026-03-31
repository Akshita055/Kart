import { useEffect, useState } from 'react'

const THEME_KEY = 'campuskart-theme'

function getInitialTheme() {
  try {
    if (typeof window === 'undefined') return 'light'

    const saved = window.localStorage.getItem(THEME_KEY)
    if (saved === 'light' || saved === 'dark') {
      return saved
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    try {
      const root = document.documentElement
      root.classList.toggle('dark', theme === 'dark')
      window.localStorage.setItem(THEME_KEY, theme)
    } catch {
      // Ignore storage failures and keep UI usable.
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return { theme, toggleTheme }
}
