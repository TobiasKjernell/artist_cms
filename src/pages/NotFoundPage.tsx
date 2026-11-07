import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-end gap-6 px-6 py-16 lg:px-10">
      <div className="bloom" aria-hidden="true" />
      <p className="font-display text-[clamp(6rem,20vw,16rem)] font-medium leading-[0.85] tracking-[-0.04em] text-bone">
        404
      </p>
      <p className="text-base text-fog">This page doesn’t exist.</p>
      <Link to="/" className="self-start">
        <Button variant="ghost">Back to artists</Button>
      </Link>
    </div>
  )
}
