import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useAuthRole } from '../../hooks/useAuthRole'
import { Spinner } from '../ui/Spinner'

export function AdminRoute({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const { role, isLoading } = useAuthRole()

  if (!token) return <Navigate to="/" replace />
  if (isLoading) return <Spinner label="Checking permissions…" />
  if (role !== 'admin') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}
