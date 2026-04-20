import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
})

export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common.Authorization
  }
}

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  updateMe: (payload) => api.patch('/auth/me', payload),
}

export const productApi = {
  list: (params) => api.get('/products', { params }),
  details: (id) => api.get(`/products/${id}`),
  add: (formData) => api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.patch(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id) => api.delete(`/products/${id}`),
  myListings: () => api.get('/products/my/listings'),
  rate: (id, payload) => api.post(`/products/${id}/rate`, payload),
  sellerRating: (sellerId) => api.get(`/products/sellers/${sellerId}/rating`),
  suggestPrice: (params) => api.get('/products/price-suggestion', { params }),
  assistant: (prompt) => api.post('/products/assistant/query', { prompt }),
}

export const wishlistApi = {
  add: (productId) => api.post('/wishlist', { productId }),
  list: () => api.get('/wishlist'),
  remove: (productId) => api.delete(`/wishlist/${productId}`),
}

export const chatApi = {
  rooms: () => api.get('/chat/rooms'),
  createRoom: (productId) => api.post('/chat/rooms', { productId }),
  messages: (roomId) => api.get(`/chat/rooms/${roomId}/messages`),
  sendMessage: (roomId, text) => api.post(`/chat/rooms/${roomId}/messages`, { text }),
}

export const offerApi = {
  list: (type = 'received') => api.get('/offers', { params: { type } }),
  create: (payload) => api.post('/offers', payload),
  respond: (offerId, action) => api.patch(`/offers/${offerId}`, { action }),
}

export const notificationApi = {
  list: () => api.get('/notifications'),
  markRead: (id) => api.patch(`/notifications/${id}/read`),
}

export const orderApi = {
  myOrders: (role = 'buyer') => api.get('/orders', { params: { role } }),
  markSold: (productId, payload) => api.patch(`/orders/products/${productId}/sold`, payload),
}

export const analyticsApi = {
  seller: () => api.get('/analytics/seller'),
  leaderboard: () => api.get('/analytics/leaderboard'),
}
