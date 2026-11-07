import { NavLink, useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import { useAuthStore } from '../../store/authStore'
import { useAuthRole } from '../../hooks/useAuthRole'
import { decodeJwtPayload } from '../../lib/jwt'
import { Button } from '../ui/Button'

const linkClasses = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'flex min-h-9 items-center rounded-ctl px-2.5 text-sm transition-colors lg:px-3',
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
    <aside className="flex flex-wrap items-center gap-x-2 gap-y-3 border-b border-hairline bg-sidebar px-4 py-3 lg:sticky lg:top-0 lg:h-svh lg:w-60 lg:shrink-0 lg:flex-col lg:items-stretch lg:gap-0 lg:border-b-0 lg:border-r lg:p-4">
      <NavLink to="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-accent lg:mb-8 lg:px-3 lg:pt-2">
        <img src="/ember-mark.svg" alt="" width={40} height={40} className="-ml-2.5 -mr-2 size-10 shrink-0 lg:-ml-3 lg:-mr-2.5 lg:size-12" />
        EMBER
      </NavLink>

      <nav aria-label="Main" className="flex flex-1 items-center gap-0.5 lg:flex-col lg:items-stretch lg:gap-1">
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
