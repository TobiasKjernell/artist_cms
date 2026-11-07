import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-panel border border-hairline bg-surface',
        className,
      )}
      {...props}
    />
  )
}
