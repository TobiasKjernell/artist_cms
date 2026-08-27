import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Role = 'admin' | 'artist' | 'unknown'

type AuthState = {
  token: string | null
  role: Role
  setToken: (token: string) => void
  setRole: (role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({ 
      token: null,
      role: 'unknown',
      setToken: (token) => set({ token, role: 'unknown' }),
      setRole: (role) => set({ role }),
      logout: () => set({ token: null, role: 'unknown' }),
    }),
    {
      name: 'ember-auth',
      partialize: (state) => ({ token: state.token }),
    },
  ),
)
