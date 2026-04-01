import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext'

const AUTH_KEY = 'campuskart-user'
const CART_KEY = 'campuskart-cart'
const WISHLIST_KEY = 'campuskart-wishlist'

function getInitialUser() {
  try {
    const raw = window.localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function getInitialList(key) {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function AppProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])
  const [user, setUser] = useState(getInitialUser)
  const [cartItems, setCartItems] = useState(() => getInitialList(CART_KEY))
  const [wishlistItems, setWishlistItems] = useState(() => getInitialList(WISHLIST_KEY))

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
      photoUrl: '',
    }
    setUser(nextUser)
    try {
      window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
    } catch {
      // Ignore storage failures.
    }
    return nextUser
  }, [user])

  const signUp = useCallback(({ name, email, course, specialization, year, universityRollNo, photoUrl }) => {
    const nextUser = {
      name,
      email,
      course,
      specialization,
      year,
      universityRollNo,
      photoUrl: photoUrl || '',
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

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      try {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage failures.
      }
      return next
    })
  }, [])

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const decreaseCartItem = useCallback((productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const increaseCartItem = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const toggleWishlist = useCallback((product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id)
      if (exists) return prev.filter((item) => item.id !== product.id)
      return [...prev, product]
    })
  }, [])

  const removeFromWishlist = useCallback((productId) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId))
  }, [])

  const moveWishlistToCart = useCallback(
    (product) => {
      addToCart(product)
      removeFromWishlist(product.id)
    },
    [addToCart, removeFromWishlist],
  )

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  )

  const checkout = useCallback(() => {
    // Placeholder action before payment integration.
    setCartItems([])
    return { status: 'success' }
  }, [])

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems],
  )
  const wishlistCount = wishlistItems.length
  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
    } catch {
      // Ignore storage failures.
    }
  }, [cartItems])

  useEffect(() => {
    try {
      window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems))
    } catch {
      // Ignore storage failures.
    }
  }, [wishlistItems])

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
      updateProfile,
      cartItems,
      wishlistItems,
      cartCount,
      wishlistCount,
      cartSubtotal,
      addToCart,
      decreaseCartItem,
      increaseCartItem,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      moveWishlistToCart,
      isInWishlist,
      checkout,
    }),
    [
      searchQuery,
      toasts,
      user,
      signIn,
      signUp,
      signOut,
      updateProfile,
      cartItems,
      wishlistItems,
      cartCount,
      wishlistCount,
      cartSubtotal,
      addToCart,
      decreaseCartItem,
      increaseCartItem,
      removeFromCart,
      clearCart,
      toggleWishlist,
      removeFromWishlist,
      moveWishlistToCart,
      isInWishlist,
      checkout,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
