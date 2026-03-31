import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { Navbar } from './components/Navbar'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { Sidebar } from './components/Sidebar'
import { ToastContainer } from './components/ToastContainer'
import { AppProvider } from './hooks/AppProvider'
import { useTheme } from './hooks/useTheme'
import { AddProductPage } from './pages/AddProductPage'
import { AuthPage } from './pages/AuthPage'
import { ChatPage } from './pages/ChatPage'
import { HomePage } from './pages/HomePage'
import { ProductDetailsPage } from './pages/ProductDetailsPage'
import { ProfilePage } from './pages/ProfilePage'

function RouteScrollReset() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location.pathname])

  return null
}

function AppShell() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const isAuthRoute = location.pathname === '/auth'

  return (
    <div className='relative min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_38%,#f0f9ff_100%)] pb-24 text-slate-900 transition-colors duration-300 dark:bg-[linear-gradient(180deg,#111827_0%,#020617_45%,#0b1220_100%)] dark:text-slate-100 lg:pb-8'>
      <div className='pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-indigo-400/25 blur-[90px]' />
      <div className='pointer-events-none absolute -right-24 top-0 h-72 w-72 rounded-full bg-cyan-300/25 blur-[95px]' />
      <div className='pointer-events-none absolute bottom-10 left-1/3 h-72 w-72 rounded-full bg-blue-300/20 blur-[100px]' />

      <RouteScrollReset />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <div
        className={`relative mx-auto gap-6 px-4 py-7 lg:px-6 ${
          isAuthRoute ? 'max-w-3xl' : 'grid max-w-7xl lg:grid-cols-[256px_1fr]'
        }`}
      >
        {isAuthRoute ? null : <Sidebar />}
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path='/' element={<HomePage />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/product/:id' element={<ProductDetailsPage />} />
            <Route path='/add-product' element={<AddProductPage />} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/profile' element={<ProfilePage />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      <ToastContainer />
      <ScrollToTopButton />
      {isAuthRoute ? null : <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
