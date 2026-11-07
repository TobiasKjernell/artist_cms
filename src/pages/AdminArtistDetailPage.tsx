import { Link, useParams } from 'react-router-dom'
import { useArtistAdmin } from '../hooks/useArtists'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/ErrorState'
import { TourDatesManager } from '../components/dashboard/TourDatesManager'
import { YoutubeManager } from '../components/dashboard/YoutubeManager'
import { GalleryManager } from '../components/dashboard/GalleryManager'
import { MerchManager } from '../components/dashboard/MerchManager'
import { Tabs } from '../components/ui/Tabs'
import { PageHeader } from '../components/ui/PageHeader'

export default function AdminArtistDetailPage() {
  const { slug = '' } = useParams()
  const { data: artist, isLoading, isError, error, refetch } = useArtistAdmin(slug)

  if (isLoading) return <Spinner label="Loading artist…" />
  if (isError) return <ErrorState error={error} onRetry={() => refetch()} />
  if (!artist) return null

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10">
      <PageHeader
        title={artist.display_name}
        description="You're editing this artist's videos, tour dates, gallery and merch on their behalf."
        crumbs={
          <>
            <Link to="/admin" className="text-bone-dim transition-colors hover:text-bone">
              All artists
            </Link>
            <span aria-hidden="true">/</span>
            <span>@{artist.slug}</span>
          </>
        }
      />

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
