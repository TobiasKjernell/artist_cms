import type { ReactNode } from 'react'

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string
  description?: string
  crumbs?: ReactNode
  actions?: ReactNode
}) {
  return (
    <header className="mb-8 border-b border-hairline pb-6">
      {crumbs && <div className="mb-3 flex items-center gap-2 text-sm text-fog">{crumbs}</div>}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="font-display text-3xl text-bone">{title}</h1>
          {description && <p className="mt-1.5 max-w-xl text-sm text-fog">{description}</p>}
        </div>
        {actions}
      </div>
    </header>
  )
}
