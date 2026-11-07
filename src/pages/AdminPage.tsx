import { useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { useArtistsAdmin, useCreateArtist } from '../hooks/useArtists'
import { artistCreateFormSchema, type ArtistCreateForm } from '../schemas/artist'
import { Spinner } from '../components/ui/Spinner'
import { ErrorState } from '../components/ui/ErrorState'
import { errorMessage } from '../lib/errors'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { Dialog } from '../components/ui/Dialog'
import { Field, Input } from '../components/ui/Field'
import { Card } from '../components/ui/Card'
import { PageHeader } from '../components/ui/PageHeader'
import { Icon } from '../components/ui/Icon'

type SortKey = 'display_name' | 'username' | 'slug'

function NewArtistDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createMutation = useCreateArtist()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ArtistCreateForm>({ resolver: zodResolver(artistCreateFormSchema) })

  const close = () => {
    reset()
    setSubmitError(null)
    onClose()
  }

  const onSubmit = async (data: ArtistCreateForm) => {
    setSubmitError(null)
    try {
      await createMutation.mutateAsync(data)
      close()
    } catch (error) {
      setSubmitError(errorMessage(error))
    }
  }

  return (
    <Dialog open={open} onClose={close} title="New artist">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Field label="Display name" error={errors.display_name?.message}>
          <Input hasError={Boolean(errors.display_name)} {...register('display_name')} />
        </Field>
        <Field label="Slug" error={errors.slug?.message}>
          <Input placeholder="artist-slug" hasError={Boolean(errors.slug)} {...register('slug')} />
        </Field>
        <Field label="Username" error={errors.username?.message}>
          <Input hasError={Boolean(errors.username)} {...register('username')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="password" hasError={Boolean(errors.password)} {...register('password')} />
        </Field>
        {submitError && <p className="text-sm text-red-300/90">{submitError}</p>}
        <Button type="submit" loading={createMutation.isPending} className="mt-1 w-full">
          Create artist
        </Button>
      </form>
    </Dialog>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch } = useArtistsAdmin()
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('display_name')
  const [dialogOpen, setDialogOpen] = useState(false)

  // The admin account itself is never an artist — exclude it from this list.
  const artists = useMemo(() => data?.filter((a) => !a.is_admin) ?? [], [data])

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? artists.filter(
          (a) =>
            a.display_name.toLowerCase().includes(q) ||
            a.username.toLowerCase().includes(q) ||
            a.slug.toLowerCase().includes(q),
        )
      : artists
    return [...filtered].sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
  }, [artists, search, sortKey])

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-6 py-10 lg:px-10">
      <PageHeader
        title="All artists"
        description="Every artist account on the platform. Open one to edit their page content."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Icon name="plus" />
            New artist
          </Button>
        }
      />

      {isLoading && <Spinner label="Loading artists…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}

      {data && artists.length === 0 && (
        <EmptyState
          title="No artists yet"
          description="Create the first artist account to get started."
          action={
            <Button variant="ghost" onClick={() => setDialogOpen(true)}>
              + New artist
            </Button>
          }
        />
      )}

      {data && artists.length > 0 && (
        <>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Input
              placeholder="Search by name, username, or slug…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm"
            />
            <div className="flex items-center gap-1 text-sm text-fog">
              <span className="mr-1">Sort by</span>
              {(['display_name', 'username', 'slug'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSortKey(key)}
                  className={
                    'cursor-pointer rounded-ctl px-3 py-1.5 capitalize transition-colors ' +
                    (sortKey === key ? 'bg-surface-raised text-bone' : 'hover:text-bone-dim')
                  }
                >
                  {key.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {rows.length === 0 ? (
            <EmptyState title="No matches" description={`Nothing found for "${search}".`} />
          ) : (
            <Card className="overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-hairline bg-surface-raised text-sm text-fog">
                    <th className="px-5 py-2.5 font-medium">Display name</th>
                    <th className="px-5 py-3 font-medium">Username</th>
                    <th className="px-5 py-3 font-medium">Slug</th>
                    <th className="px-5 py-3 font-medium" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((artist) => (
                    <tr
                      key={artist.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/artists/${artist.slug}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') navigate(`/admin/artists/${artist.slug}`)
                      }}
                      className="cursor-pointer border-b border-hairline/60 transition-colors last:border-0 hover:bg-surface-raised"
                    >
                      <td className="px-5 py-3 text-bone">{artist.display_name}</td>
                      <td className="px-5 py-3 text-bone-dim">{artist.username}</td>
                      <td className="px-5 py-3 text-fog">@{artist.slug}</td>
                      <td className="px-5 py-3 text-right text-sm text-accent">Manage</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </>
      )}

      <NewArtistDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  )
}
