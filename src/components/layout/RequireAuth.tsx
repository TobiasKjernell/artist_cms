import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

/** Any signed-in user (artist or admin); everyone else is sent to the login screen. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const location = useLocation()
  if (!token) return <Navigate to="/" replace state={{ from: location }} />
  return <>{children}</>
}
