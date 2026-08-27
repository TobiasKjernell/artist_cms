import { useAuthStore } from '../store/authStore'
import { decodeJwtPayload } from '../lib/jwt'
import { YoutubeManager } from '../components/dashboard/YoutubeManager'
import { TourDatesManager } from '../components/dashboard/TourDatesManager'

export default function DashboardPage() {
  const token = useAuthStore((s) => s.token)
  const username = token ? (decodeJwtPayload(token)?.sub as string | undefined) : undefined

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <div className="animate-fade-up mb-12">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-fog">
          {username ? `Signed in as ${username}` : 'Dashboard'}
        </p>
        <h1 className="font-display text-4xl text-bone">Your content</h1>
        <p className="mt-2 max-w-lg text-sm text-fog">
          Manage the videos and tour dates shown on your public artist page.
        </p>
      </div>

      <div className="flex flex-col gap-14">
        <TourDatesManager />
        <YoutubeManager />
      </div>
    </div>
  )
}
