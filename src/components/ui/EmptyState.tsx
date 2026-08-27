import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-hairline px-8 py-16 text-center">
      <h3 className="font-display text-lg text-bone">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fog">{description}</p>}
      {action}
    </div>
  )
}
