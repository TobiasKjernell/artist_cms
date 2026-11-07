import { errorMessage } from '../../lib/errors'
import { Button } from './Button'

export function ErrorState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-panel border border-danger-line bg-surface px-8 py-10 text-center">
      <h3 className="text-base font-medium text-bone">Couldn’t load that</h3>
      <p className="max-w-sm text-sm text-fog">{errorMessage(error)}</p>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}
