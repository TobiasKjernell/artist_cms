import { Link, useParams } from 'react-router-dom'
import { useArtistAdmin } from '../hooks/useArtists'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/ErrorState'
import { TourDatesManager } from '../components/dashboard/TourDatesManager'
import { YoutubeManager } from '../components/dashboard/YoutubeManager'
import { GalleryManager } from '../components/dashboard/GalleryManager'
import { MerchManager } from '../components/dashboard/MerchManager'
import { Tabs } from '../components/ui/Tabs'

export default function AdminArtistDetailPage() {
  const { slug = '' } = useParams()
  const { data: artist, isLoading, isError, error, refetch } = useArtistAdmin(slug)

  if (isLoading) return <Spinner label="Loading artist…" />
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!artist) return null

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-16">
      <Link
        to="/admin"
        className="mb-8 inline-block text-xs uppercase tracking-[0.2em] text-fog transition-colors hover:text-bone-dim"
      >
        ← All artists
      </Link>

      <div className="animate-fade-up mb-12">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-fog">Managing @{artist.slug}</p>
        <h1 className="font-display text-4xl text-bone">{artist.display_name}</h1>
        <p className="mt-2 max-w-lg text-sm text-fog">
          You're editing this artist's videos, tour dates, and gallery on their behalf.
        </p>
      </div>

      <Tabs
        tabs={[
          { id: 'tour-dates', label: 'Tour dates', content: <TourDatesManager slug={artist.slug} /> },
          { id: 'videos', label: 'Videos', content: <YoutubeManager slug={artist.slug} /> },
          { id: 'gallery', label: 'Gallery', content: <GalleryManager slug={artist.slug} /> },
          { id: 'merch', label: 'Merch', content: <MerchManager slug={artist.slug} /> },
        ]}
      />
    </div>
  )
}
