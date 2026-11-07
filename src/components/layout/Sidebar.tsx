import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useAuthRole } from '../../hooks/useAuthRole'
import { decodeJwtPayload } from '../../lib/jwt'
import { Button } from '../ui/Button'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex min-h-9 items-center rounded-ctl px-3 text-sm transition-colors',
    isActive ? 'bg-surface-raised text-bone' : 'text-fog hover:bg-surface hover:text-bone-dim',
  )

/** The CMS shell for signed-in areas: collections on the left, work on the right. */
export function Sidebar() {
  const navigate = useNavigate()
  const token = useAuthStore((s) => s.token)
  const logout = useAuthStore((s) => s.logout)
  const { role } = useAuthRole()
  const username = token ? (decodeJwtPayload(token)?.sub as string | undefined) : undefined

  return (
    <aside className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-hairline bg-sidebar px-4 py-3 lg:sticky lg:top-0 lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col lg:items-stretch lg:gap-0 lg:border-b-0 lg:border-r lg:p-4">
      <NavLink to="/" className="font-display text-xl tracking-tight text-accent lg:mb-8 lg:px-3 lg:pt-2">
        EMBER
      </NavLink>

      <nav aria-label="Main" className="flex flex-1 items-center gap-1 lg:flex-col lg:items-stretch">
        {role === 'artist' && (
          <NavLink to="/dashboard" className={linkClasses}>
            My content
          </NavLink>
        )}
        {role === 'admin' && (
          <NavLink to="/admin" className={linkClasses}>
            Artists
          </NavLink>
        )}
        <NavLink to="/help" className={linkClasses}>
          Help
        </NavLink>
      </nav>

      <div className="flex items-center gap-3 lg:flex-col lg:items-stretch lg:border-t lg:border-hairline lg:pt-4">
        <div className="hidden min-w-0 px-3 lg:block">
          <p className="truncate text-sm text-bone">{username ?? 'Signed in'}</p>
          <p className="text-xs text-fog">{role === 'admin' ? 'Administrator' : 'Artist'}</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Log out
        </Button>
      </div>
    </aside>
  )
}
