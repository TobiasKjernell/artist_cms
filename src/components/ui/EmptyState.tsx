import type { ReactNode } from 'react'

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-panel border border-dashed border-hairline-strong px-8 py-12 text-center">
      <h3 className="text-base font-medium text-bone">{title}</h3>
      {description && <p className="max-w-sm text-sm text-fog">{description}</p>}
      {action}
    </div>
  )
}
