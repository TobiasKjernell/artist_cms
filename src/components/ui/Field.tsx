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
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-fog">{label}</span>
      {children}
      {error && <span className="text-xs text-red-300/90">{error}</span>}
    </label>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { hasError?: boolean }

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, hasError, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      'rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-bone placeholder:text-fog/60 outline-none transition-colors duration-150 focus:border-accent/60',
      hasError ? 'border-red-500/40' : 'border-hairline',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'
