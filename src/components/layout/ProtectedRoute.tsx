import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuthRole } from '../../hooks/useAuthRole'
import { Spinner } from '../ui/Spinner'

/** Guards the artist dashboard specifically — admins aren't artists, so they
 * never land here even if they hit the URL directly. */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const { role, isLoading } = useAuthRole()
  const location = useLocation()

  if (!token) return <Navigate to="/" replace state={{ from: location }} />
  if (isLoading) return <Spinner label="Loading…" />
  if (role === 'admin') return <Navigate to="/admin" replace />
  return <>{children}</>
}
