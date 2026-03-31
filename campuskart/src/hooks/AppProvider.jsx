import { useCallback, useMemo, useState } from 'react'
import { AppContext } from './appContext'

const AUTH_KEY = 'campuskart-user'

function getInitialUser() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])
  const [user, setUser] = useState(getInitialUser)

  const addToast = (message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 2500)
  }

  const signIn = useCallback(({ email }) => {
    const nextUser = user || {
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      course: 'Student',
      specialization: 'General',
      year: '1',
      universityRollNo: 'N/A',
    }
    setUser(nextUser)
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage failures.
    }
    return nextUser
  }, [user])

  const signUp = useCallback(({ name, email, course, specialization, year, universityRollNo }) => {
    const nextUser = {
      name,
      email,
      course,
      specialization,
      year,
      universityRollNo,
    }
    setUser(nextUser)
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage failures.
    }
    return nextUser
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(AUTH_KEY)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      toasts,
      addToast,
      user,
      isAuthenticated: Boolean(user),
      signIn,
      signUp,
      signOut,
    }),
    [searchQuery, toasts, user, signIn, signUp, signOut],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
