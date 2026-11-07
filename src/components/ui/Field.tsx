import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'
import clsx from 'clsx'

type FieldProps = {
  label: string
  error?: string
  children: ReactNode
}

export function Field({ label, error, children }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-bone-dim">{label}</span>
      {children}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, hasError, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'min-h-9 rounded-ctl border bg-surface px-3 py-1.5 text-sm text-bone placeholder:text-fog/60 outline-none transition-colors duration-150 focus:border-accent',
      hasError ? 'border-danger' : 'border-edge',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
