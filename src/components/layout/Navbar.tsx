import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useAuthRole } from '../../hooks/useAuthRole'
import { Button } from '../ui/Button'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'text-sm transition-colors',
    isActive ? 'text-bone' : 'text-fog hover:text-bone-dim',
  )

export function Navbar() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const { role } = useAuthRole()

  return (
    <header className="sticky top-0 z-40 border-b border-hairline/80 bg-void/90">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 lg:px-10">
        <NavLink to="/" className="font-display text-lg tracking-tight text-accent">
          EMBER
        </NavLink>
        <nav className="flex items-center gap-6">
          {token && role === 'artist' && (
            <NavLink to="/dashboard" className={linkClasses}>
              Dashboard
            </NavLink>
          )}
          {token && role === 'admin' && (
            <NavLink to="/admin" className={linkClasses}>
              Admin
            </NavLink>
          )}
          {token && (
            <NavLink to="/help" className={linkClasses}>
              Help
            </NavLink>
          )}
          {token ? (
            <Button
              variant="ghost"
              onClick={() => {
                logout()
                navigate('/')
              }}
            >
              Log out
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/')}>
              Log in
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
