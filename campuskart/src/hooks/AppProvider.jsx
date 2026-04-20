import { useCallback, useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext'
import {
  analyticsApi,
  authApi,
  chatApi,
  notificationApi,
  offerApi,
  orderApi,
  productApi,
  setAuthToken,
  wishlistApi,
} from '../lib/api'
import { getSocket } from '../lib/socket'

const AUTH_KEY = 'campuskart-user'
const TOKEN_KEY = 'campuskart-token'
const CART_KEY = 'campuskart-cart'

function safeParse(raw, fallback = null) {
  try {
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function loadStoredAuth() {
  const user = safeParse(window.localStorage.getItem(AUTH_KEY), null)
  const token = window.localStorage.getItem(TOKEN_KEY)
  return { user, token }
}

function loadCart() {
  return safeParse(window.localStorage.getItem(CART_KEY), []) || []
}

export function AppProvider({ children }) {
  const stored = loadStoredAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState([])
  const [user, setUser] = useState(stored.user)
  const [token, setToken] = useState(stored.token)
  const [products, setProducts] = useState([])
  const [homeLoading, setHomeLoading] = useState(false)
  const [homeFilters, setHomeFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: 700,
    seller: '',
    listingKind: '',
    radiusKm: 8,
  })
  const [wishlistItems, setWishlistItems] = useState([])
  const [cartItems, setCartItems] = useState(loadCart)
  const [notifications, setNotifications] = useState([])
  const [myListings, setMyListings] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [assistantResults, setAssistantResults] = useState([])
  const [offers, setOffers] = useState([])

  useEffect(() => {
    setAuthToken(token)
  }, [token])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 2500)
  }, [])

  const persistAuth = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
    window.localStorage.setItem(TOKEN_KEY, nextToken)
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    const { data } = await authApi.login({ email, password })
    persistAuth(data.user, data.token)
    return data.user
  }, [persistAuth])

  const signUp = useCallback(async (payload) => {
    const { data } = await authApi.register(payload)
    persistAuth(data.user, data.token)
    return data.user
  }, [persistAuth])

  const signOut = useCallback(() => {
    setUser(null)
    setToken('')
    setWishlistItems([])
    setNotifications([])
    setMyListings([])
    setAnalytics(null)
    window.localStorage.removeItem(AUTH_KEY)
    window.localStorage.removeItem(TOKEN_KEY)
    setAuthToken('')
  }, [])

  const updateProfile = useCallback(async (updates) => {
    const { data } = await authApi.updateMe(updates)
    setUser(data)
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(data))
    return data
  }, [])

  const fetchProducts = useCallback(async (override = {}) => {
    const filters = { ...homeFilters, ...override }
    const params = {
      search: override.search ?? searchQuery,
      category: filters.category === 'all' ? '' : filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      seller: filters.seller,
      listingKind: filters.listingKind,
      radiusKm: filters.radiusKm,
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setHomeLoading(true)
            const { data } = await productApi.list({
              ...params,
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
            setProducts(data)
          } catch {
            addToast('Failed to fetch products', 'error')
          } finally {
            setHomeLoading(false)
          }
        },
        async () => {
          try {
            setHomeLoading(true)
            const { data } = await productApi.list(params)
            setProducts(data)
          } catch {
            addToast('Failed to fetch products', 'error')
          } finally {
            setHomeLoading(false)
          }
        },
      )
      return
    }

    try {
      setHomeLoading(true)
      const { data } = await productApi.list(params)
      setProducts(data)
    } catch {
      addToast('Failed to fetch products', 'error')
    } finally {
      setHomeLoading(false)
    }
  }, [addToast, homeFilters, searchQuery])

  const loadWishlist = useCallback(async () => {
    if (!token) return
    try {
      const { data } = await wishlistApi.list()
      setWishlistItems(data)
    } catch {
      setWishlistItems([])
    }
  }, [token])

  const toggleWishlist = useCallback(async (product) => {
    if (!token) {
      addToast('Login required to use wishlist', 'error')
      return
    }
    const exists = wishlistItems.some((item) => item._id === product._id)
    if (exists) {
      await wishlistApi.remove(product._id)
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id))
    } else {
      await wishlistApi.add(product._id)
      await loadWishlist()
    }
  }, [addToast, loadWishlist, token, wishlistItems])

  const isInWishlist = useCallback((productId) => wishlistItems.some((item) => item._id === productId), [wishlistItems])

  const removeFromWishlist = useCallback(async (productId) => {
    await wishlistApi.remove(productId)
    setWishlistItems((prev) => prev.filter((item) => item._id !== productId))
  }, [])

  const moveWishlistToCart = useCallback((product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item._id === product._id)
      if (exists) {
        return prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    removeFromWishlist(product._id)
  }, [removeFromWishlist])

  const addToCart = useCallback((product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id)
      if (existing) {
        return prev.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const decreaseCartItem = useCallback((productId) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const increaseCartItem = useCallback((productId) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId))
  }, [])

  const clearCart = useCallback(() => setCartItems([]), [])

  const checkout = useCallback(async () => {
    if (!token || !cartItems.length) return { status: 'error' }
    const first = cartItems[0]
    if (first?.userId?._id) {
      await orderApi.markSold(first._id, {
        buyerId: user.id,
        finalAmount: first.price,
      })
    }
    setCartItems([])
    return { status: 'success' }
  }, [cartItems, token, user])

  const postProduct = useCallback(async ({ payload, files }) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, value)
      }
    })
    files.forEach((file) => formData.append('images', file))

    const { data } = await productApi.add(formData)
    await fetchProducts()
    return data
  }, [fetchProducts])

  const loadMyListings = useCallback(async () => {
    if (!token) return
    const { data } = await productApi.myListings()
    setMyListings(data)
  }, [token])

  const updateListing = useCallback(async (id, payload) => {
    const formData = new FormData()
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value)
      }
    })
    await productApi.update(id, formData)
    await Promise.all([fetchProducts(), loadMyListings()])
  }, [fetchProducts, loadMyListings])

  const deleteListing = useCallback(async (id) => {
    await productApi.remove(id)
    await Promise.all([fetchProducts(), loadMyListings()])
  }, [fetchProducts, loadMyListings])

  const rateSeller = useCallback((id, stars, review) => productApi.rate(id, { stars, review }), [])
  const getSellerRating = useCallback(async (sellerId) => {
    const { data } = await productApi.sellerRating(sellerId)
    return data
  }, [])

  const suggestPrice = useCallback(async (category, title) => {
    const { data } = await productApi.suggestPrice({ category, title })
    return data?.suggestion
  }, [])

  const runAssistantQuery = useCallback(async (prompt) => {
    const { data } = await productApi.assistant(prompt)
    setAssistantResults(data.results || [])
    return data
  }, [])

  const loadNotifications = useCallback(async () => {
    if (!token) return
    const { data } = await notificationApi.list()
    setNotifications(data)
  }, [token])

  const markNotificationRead = useCallback(async (id) => {
    await notificationApi.markRead(id)
    setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, read: true } : item)))
  }, [])

  const loadAnalytics = useCallback(async () => {
    if (!token) return
    const [{ data: sellerData }, { data: leaderboardData }] = await Promise.all([
      analyticsApi.seller(),
      analyticsApi.leaderboard(),
    ])
    setAnalytics(sellerData)
    setLeaderboard(leaderboardData)
  }, [token])

  const loadOffers = useCallback(async (type = 'received') => {
    if (!token) return
    const { data } = await offerApi.list(type)
    setOffers(data)
  }, [token])

  const sendOffer = useCallback(async (payload) => {
    const { data } = await offerApi.create(payload)
    await loadOffers('sent')
    return data
  }, [loadOffers])

  const respondOffer = useCallback(async (offerId, action) => {
    const { data } = await offerApi.respond(offerId, action)
    await loadOffers('received')
    return data
  }, [loadOffers])

  const ensureChatRoom = useCallback(async (productId) => {
    const { data } = await chatApi.createRoom(productId)
    return data
  }, [])

  useEffect(() => {
    window.localStorage.setItem(CART_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    if (!token) return
    loadWishlist()
    loadNotifications()
    loadMyListings()
    loadAnalytics()
    loadOffers('received')
  }, [loadAnalytics, loadMyListings, loadNotifications, loadOffers, loadWishlist, token])

  useEffect(() => {
    if (!user?.id || !token) return
    const socket = getSocket()
    socket.emit('auth:join', { userId: user.id })
    const onNotification = () => {
      loadNotifications()
    }
    socket.on('notification:new', onNotification)
    return () => {
      socket.off('notification:new', onNotification)
    }
  }, [loadNotifications, token, user?.id])

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems])
  const wishlistCount = wishlistItems.length
  const cartSubtotal = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems])

  const value = useMemo(() => ({
    searchQuery,
    setSearchQuery,
    toasts,
    addToast,
    user,
    token,
    isAuthenticated: Boolean(user && token),
    signIn,
    signUp,
    signOut,
    updateProfile,
    products,
    homeLoading,
    homeFilters,
    setHomeFilters,
    fetchProducts,
    cartItems,
    wishlistItems,
    notifications,
    myListings,
    analytics,
    leaderboard,
    assistantResults,
    offers,
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
    postProduct,
    updateListing,
    deleteListing,
    rateSeller,
    getSellerRating,
    suggestPrice,
    runAssistantQuery,
    loadNotifications,
    markNotificationRead,
    loadOffers,
    sendOffer,
    respondOffer,
    ensureChatRoom,
  }), [
    addToast,
    addToCart,
    analytics,
    assistantResults,
    cartCount,
    cartItems,
    cartSubtotal,
    checkout,
    clearCart,
    decreaseCartItem,
    deleteListing,
    ensureChatRoom,
    fetchProducts,
    getSellerRating,
    homeFilters,
    homeLoading,
    increaseCartItem,
    isInWishlist,
    leaderboard,
    loadNotifications,
    loadOffers,
    markNotificationRead,
    moveWishlistToCart,
    myListings,
    notifications,
    offers,
    postProduct,
    products,
    rateSeller,
    removeFromCart,
    removeFromWishlist,
    respondOffer,
    runAssistantQuery,
    searchQuery,
    sendOffer,
    setHomeFilters,
    signIn,
    signOut,
    signUp,
    suggestPrice,
    toasts,
    toggleWishlist,
    token,
    updateListing,
    updateProfile,
    user,
    wishlistCount,
    wishlistItems,
  ])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
