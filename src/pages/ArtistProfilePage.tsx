import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useArtist, useArtistImages, useArtistTourDates, useArtistYoutube } from '../hooks/useArtists'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/ErrorState'
import { EmptyState } from '../components/ui/EmptyState'
import { Card } from '../components/ui/Card'
import { Lightbox } from '../components/ui/Lightbox'
import { formatDate } from '../lib/format'
import { toYoutubeEmbedUrl } from '../lib/youtube'

export default function ArtistProfilePage() {
  const { slug = '' } = useParams()
  const artistQuery = useArtist(slug)
  const youtubeQuery = useArtistYoutube(slug)
  const tourDatesQuery = useArtistTourDates(slug)
  const imagesQuery = useArtistImages(slug)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)

  if (artistQuery.isLoading) return <Spinner label="Loading artist…" />
  if (artistQuery.isError) return <ErrorState error={artistQuery.error} onRetry={() => artistQuery.refetch()} />
  if (!artistQuery.data) return null

  const artist = artistQuery.data

  return (
    <div className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
      <div className="animate-fade-up mb-16">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-fog">@{artist.slug}</p>
        <h1 className="font-display text-5xl text-bone">{artist.display_name}</h1>
      </div>

      <section className="mb-16">
        <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog">Videos</h2>
        {youtubeQuery.isLoading && <Spinner label="Loading videos…" />}
        {youtubeQuery.isError && <ErrorState error={youtubeQuery.error} />}
        {youtubeQuery.data && youtubeQuery.data.length === 0 && (
          <EmptyState title="No videos yet" description="This artist hasn't added any videos." />
        )}
        {youtubeQuery.data && youtubeQuery.data.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {youtubeQuery.data.map((v) => {
              const embedUrl = toYoutubeEmbedUrl(v.video)
              return (
                <div key={v.id} className="overflow-hidden rounded-2xl border border-hairline">
                  {embedUrl ? (
                    <iframe
                      className="aspect-video w-full"
                      src={embedUrl}
                      title={v.title || `Video ${v.id}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex aspect-video items-center justify-center bg-surface text-sm text-fog">
                      Unable to preview video
                    </div>
                  )}
                  {v.title && <p className="px-4 py-3 text-sm text-bone-dim">{v.title}</p>}
                </div>
              )
            })}
          </div>
        )}
      </section>

      <section className="mb-16">
        <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog">Gallery</h2>
        {imagesQuery.isLoading && <Spinner label="Loading gallery…" />}
        {imagesQuery.isError && <ErrorState error={imagesQuery.error} />}
        {imagesQuery.data && imagesQuery.data.length === 0 && (
          <EmptyState title="No photos yet" description="This artist hasn't added any photos." />
        )}
        {imagesQuery.data && imagesQuery.data.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {imagesQuery.data.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setLightboxSrc(image.url)}
                className="aspect-square cursor-pointer overflow-hidden rounded-2xl border border-hairline transition-opacity hover:opacity-90"
              >
                <img src={image.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-fog">Tour dates</h2>
        {tourDatesQuery.isLoading && <Spinner label="Loading tour dates…" />}
        {tourDatesQuery.isError && <ErrorState error={tourDatesQuery.error} />}
        {tourDatesQuery.data && tourDatesQuery.data.length === 0 && (
          <EmptyState title="No upcoming dates" description="This artist has no tour dates announced." />
        )}
        {tourDatesQuery.data && tourDatesQuery.data.length > 0 && (
          <div className="flex flex-col gap-3">
            {tourDatesQuery.data.map((td) => (
              <Card key={td.id} className="flex flex-col justify-between gap-3 p-5 sm:flex-row sm:items-center">
                <div>
                  <p className="font-display text-lg text-bone">{td.venue}</p>
                  <p className="text-sm text-fog">
                    {td.location} · {formatDate(td.date)}
                  </p>
                </div>
                {td.tickets_state ? (
                  <a
                    href={td.tickets_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-hairline-strong px-5 py-2 text-sm text-bone-dim transition-colors hover:border-accent/60 hover:text-bone"
                  >
                    Tickets
                  </a>
                ) : (
                  <span className="text-sm text-fog">Sold out</span>
                )}
              </Card>
            ))}
          </div>
        )}
      </section>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  )
}
