import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { queryClient } from './lib/queryClient'
import { Navbar } from './components/layout/Navbar'
import { ProtectedRoute } from './components/layout/ProtectedRoute'
import { AdminRoute } from './components/layout/AdminRoute'
import { IntroAnimation } from './components/intro/IntroAnimation'
import ArtistProfilePage from './pages/ArtistProfilePage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import AdminArtistDetailPage from './pages/AdminArtistDetailPage'
import HelpPage from './pages/HelpPage'
import NotFoundPage from './pages/NotFoundPage'

function AppShell() {
  const location = useLocation()
  const isLandingPage = location.pathname === '/'

  return (
    <>
      {!isLandingPage && <Navbar />}
      <main className="flex flex-1 flex-col">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/artists/:slug" element={<ArtistProfilePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/artists/:slug"
            element={
              <AdminRoute>
                <AdminArtistDetailPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <IntroAnimation />
        <AppShell />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
