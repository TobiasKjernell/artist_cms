import type { ReactNode } from 'react'
import clsx from 'clsx'

type Tone = 'neutral' | 'good' | 'warn' | 'muted'

const tones: Record<Tone, string> = {
  neutral: 'border-hairline-strong text-bone-dim',
  good: 'border-success/40 text-success',
  warn: 'border-warn/40 text-warn',
  muted: 'border-hairline text-fog',
}

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={clsx('inline-flex items-center rounded-ctl border px-2 py-0.5 text-xs font-medium', tones[tone])}>
      {children}
    </span>
  )
}
