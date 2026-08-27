import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <p className="font-display text-6xl text-bone">404</p>
      <p className="text-sm text-fog">This page doesn't exist.</p>
      <Link to="/">
        <Button variant="ghost">Back to artists</Button>
      </Link>
    </div>
  )
}
