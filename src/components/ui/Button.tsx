import { type ButtonHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

type Variant = 'primary' | 'ghost' | 'danger'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  loading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent text-accent-ink hover:bg-accent-hot disabled:hover:bg-accent',
  ghost:
    'bg-surface-raised text-bone-dim border border-hairline-strong hover:border-fog hover:text-bone',
  danger: 'bg-transparent text-danger border border-danger-line hover:border-danger',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex cursor-pointer items-center justify-center gap-2 min-h-9 rounded-ctl px-3.5 py-1.5 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {loading && (
        <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'
