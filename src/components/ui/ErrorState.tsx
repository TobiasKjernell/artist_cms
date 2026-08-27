import { errorMessage } from '../../lib/errors'
import { Button } from './Button'

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-8 py-14 text-center">
      <h3 className="font-display text-lg text-bone">Couldn't load that</h3>
      <p className="max-w-sm text-sm text-fog">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
