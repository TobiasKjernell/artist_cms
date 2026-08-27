import type { HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-hairline bg-surface/60 backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}
