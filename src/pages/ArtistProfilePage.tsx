import { useMemo, useState, type ReactNode } from 'react'
import { useParams } from 'react-router-dom'
import { useArtist, useArtistImages, useArtistTourDates, useArtistYoutube } from '../hooks/useArtists'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/ErrorState'
import { EmptyState } from '../components/ui/EmptyState'
import { Lightbox } from '../components/ui/Lightbox'
import { formatDate, formatDateParts } from '../lib/format'
import { toYoutubeEmbedUrl } from '../lib/youtube'

const ticketsLink =
  'inline-flex min-h-11 items-center justify-center rounded-ctl bg-accent px-5 text-sm font-medium text-accent-ink transition-colors duration-150 hover:bg-accent-hot'

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-hairline py-16 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-12">
        <h2 className="font-display text-3xl text-bone lg:text-4xl">{title}</h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

function VideoFrame({ id, video, title }: { id: number; video: string; title?: string | null }) {
  const embedUrl = toYoutubeEmbedUrl(video)
  return (
    <figure className="min-w-0">
      {embedUrl ? (
        <iframe
          className="aspect-video w-full rounded-panel border border-hairline bg-ink"
          src={embedUrl}
          title={title || `Video ${id}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="flex aspect-video items-center justify-center rounded-panel border border-hairline bg-surface text-sm text-fog">
          Unable to preview video
        </div>
      )}
      {title && <figcaption className="mt-3 text-sm text-bone-dim">{title}</figcaption>}
    </figure>
  )
}

export default function ArtistProfilePage() {
  const { slug = '' } = useParams()
  const artistQuery = useArtist(slug)
  const youtubeQuery = useArtistYoutube(slug)
  const tourDatesQuery = useArtistTourDates(slug)
  const imagesQuery = useArtistImages(slug)
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null)
  const [now] = useState(() => Date.now())

  const nextShow = useMemo(() => {
    return [...(tourDatesQuery.data ?? [])]
      .filter((td) => new Date(td.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0]
  }, [tourDatesQuery.data, now])

  if (artistQuery.isLoading) return <Spinner label="Loading artist…" />
  if (artistQuery.isError) return <ErrorState error={artistQuery.error} onRetry={() => artistQuery.refetch()} />
  if (!artistQuery.data) return null

  const artist = artistQuery.data
  const videos = youtubeQuery.data ?? []

  return (
    <div className="relative flex-1">
      <div className="bloom" aria-hidden="true" />
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-10">
        <header className="flex min-h-[calc(100svh-4rem)] flex-col justify-end gap-12 pb-12 pt-24 lg:pb-16">
          <div className="animate-fade-up min-w-0">
            <p className="mb-4 text-sm text-fog">@{artist.slug}</p>
            <h1 className="max-w-none font-display text-[clamp(3.5rem,11vw,9.5rem)] font-medium leading-[0.95] tracking-[-0.03em] text-bone">
              {artist.display_name}
            </h1>
          </div>

          {nextShow && (
            <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6 border-t border-hairline-strong pt-6">
              <div className="flex min-w-0 items-center gap-6">
                <div className="w-16 shrink-0 text-center font-display leading-none text-accent">
                  <span className="block text-4xl tabular-nums">{formatDateParts(nextShow.date).day}</span>
                  <span className="mt-1 block text-sm text-bone-dim">{formatDateParts(nextShow.date).month}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-fog">Next show</p>
                  <p className="font-display text-2xl text-bone">{nextShow.venue}</p>
                  <p className="text-sm text-bone-dim">{nextShow.location}</p>
                </div>
              </div>
              {nextShow.tickets_state ? (
                <a href={nextShow.tickets_url} target="_blank" rel="noreferrer" className={ticketsLink}>
                  Tickets
                </a>
              ) : (
                <span className="text-sm text-fog">Sold out</span>
              )}
            </div>
          )}
        </header>

        <Section id="tour-dates" title="Tour dates">
          {tourDatesQuery.isLoading && <Spinner label="Loading tour dates…" />}
          {tourDatesQuery.isError && <ErrorState error={tourDatesQuery.error} />}
          {tourDatesQuery.data && tourDatesQuery.data.length === 0 && (
            <EmptyState title="No upcoming dates" description="This artist has no tour dates announced." />
          )}
          {tourDatesQuery.data && tourDatesQuery.data.length > 0 && (
            <ul className="border-t border-hairline">
              {tourDatesQuery.data.map((td) => {
                const d = formatDateParts(td.date)
                return (
                  <li
                    key={td.id}
                    className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-x-5 gap-y-3 border-b border-hairline py-5 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto] sm:gap-x-8"
                  >
                    <time dateTime={td.date} className="font-display leading-none text-bone" aria-label={formatDate(td.date)}>
                      <span className="block text-4xl tabular-nums sm:text-5xl">{d.day}</span>
                      <span className="mt-1 block text-sm text-fog">
                        {d.month} {d.year}
                      </span>
                    </time>
                    <div className="min-w-0">
                      <p className="font-display text-xl text-bone sm:text-2xl">{td.venue}</p>
                      <p className="text-sm text-fog">{td.location}</p>
                    </div>
                    <div className="col-span-2 sm:col-span-1 sm:justify-self-end">
                      {td.tickets_state ? (
                        <a
                          href={td.tickets_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex min-h-11 items-center justify-center rounded-ctl border border-hairline-strong px-5 text-sm text-bone-dim transition-colors duration-150 hover:border-accent hover:text-bone"
                        >
                          Tickets
                        </a>
                      ) : (
                        <span className="text-sm text-fog">Sold out</span>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </Section>

        <Section id="videos" title="Videos">
          {youtubeQuery.isLoading && <Spinner label="Loading videos…" />}
          {youtubeQuery.isError && <ErrorState error={youtubeQuery.error} />}
          {youtubeQuery.data && videos.length === 0 && (
            <EmptyState title="No videos yet" description="This artist hasn’t added any videos." />
          )}
          {videos.length > 0 && (
            <div className="flex flex-col gap-8">
              <VideoFrame id={videos[0].id} video={videos[0].video} title={videos[0].title} />
              {videos.length > 1 && (
                <div className="grid gap-8 sm:grid-cols-2">
                  {videos.slice(1).map((v) => (
                    <VideoFrame key={v.id} id={v.id} video={v.video} title={v.title} />
                  ))}
                </div>
              )}
            </div>
          )}
        </Section>

        <Section id="gallery" title="Gallery">
          {imagesQuery.isLoading && <Spinner label="Loading gallery…" />}
          {imagesQuery.isError && <ErrorState error={imagesQuery.error} />}
          {imagesQuery.data && imagesQuery.data.length === 0 && (
            <EmptyState title="No photos yet" description="This artist hasn’t added any photos." />
          )}
          {imagesQuery.data && imagesQuery.data.length > 0 && (
            <div className="columns-2 gap-3 md:columns-3 [&>*]:mb-3">
              {imagesQuery.data.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => setLightboxSrc(image.url)}
                  className="block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-panel border border-hairline transition-opacity duration-150 hover:opacity-85"
                >
                  <img src={image.url} alt="" loading="lazy" decoding="async" className="h-auto w-full" />
                </button>
              ))}
            </div>
          )}
        </Section>
      </div>

      <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
    </div>
  )
}
