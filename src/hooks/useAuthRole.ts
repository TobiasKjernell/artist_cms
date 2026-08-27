import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listArtistsAdmin } from '../api/artists'
import { ApiError } from '../lib/apiClient'
import { useAuthStore } from '../store/authStore'

/** Resolves whether the logged-in user is an admin. The backend has no
 * "/me" endpoint, so this is inferred by probing an admin-only route. */
export function useAuthRole() {
  const token = useAuthStore((s) => s.token)
  const role = useAuthStore((s) => s.role)
  const setRole = useAuthStore((s) => s.setRole)

  const query = useQuery({
    queryKey: ['auth-role', token],
    enabled: Boolean(token) && role === 'unknown',
    queryFn: async () => {
      try {
        await listArtistsAdmin()
        return 'admin' as const
      } catch (error) {
        if (error instanceof ApiError && error.status === 403) return 'artist' as const
        throw error
      }
    },
  })

  useEffect(() => {
    if (query.data) setRole(query.data)
  }, [query.data, setRole])

  return {
    role,
    isLoading: Boolean(token) && role === 'unknown' && query.isLoading,
  }
}
