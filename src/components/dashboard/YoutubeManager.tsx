import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateYoutubeVideo,
  useDeleteYoutubeVideo,
  useYoutubeVideos,
  useUpdateYoutubeVideo,
} from '../../hooks/useYoutube'
import { youtubeVideoFormSchema, type YoutubeVideo, type YoutubeVideoForm } from '../../schemas/youtube'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { errorMessage } from '../../lib/errors'
import { EmptyState } from '../ui/EmptyState'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input } from '../ui/Field'

function VideoFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  submitting,
  submitError,
}: {
  open: boolean
  onClose: () => void
  initial?: YoutubeVideo
  onSubmit: (data: YoutubeVideoForm) => void
  submitting: boolean
  submitError: string | null
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<YoutubeVideoForm>({
    resolver: zodResolver(youtubeVideoFormSchema),
    values: initial
      ? { video: initial.video, title: initial.title ?? '', position: initial.position }
      : { video: '', title: '', position: 0 },
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title={initial ? 'Edit video' : 'Add video'}
    >
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col gap-4"
      >
        <Field label="YouTube video ID" error={errors.video?.message}>
          <Input placeholder="dQw4w9WgXcQ" hasError={Boolean(errors.video)} {...register('video')} />
        </Field>
        <Field label="Song name (optional)" error={errors.title?.message}>
          <Input placeholder="e.g. Midnight Drive" hasError={Boolean(errors.title)} {...register('title')} />
        </Field>
        <Field label="Position" error={errors.position?.message}>
          <Input
            type="number"
            hasError={Boolean(errors.position)}
            {...register('position', { valueAsNumber: true })}
          />
        </Field>
        {submitError && <p className="text-sm text-red-300/90">{submitError}</p>}
        <Button type="submit" loading={submitting} className="mt-1 w-full">
          {initial ? 'Save changes' : 'Add video'}
        </Button>
      </form>
    </Dialog>
  )
}

export function YoutubeManager({ slug }: { slug?: string } = {}) {
  const { data, isLoading, isError, error, refetch } = useYoutubeVideos(slug)
  const createMutation = useCreateYoutubeVideo(slug)
  const updateMutation = useUpdateYoutubeVideo(slug)
  const deleteMutation = useDeleteYoutubeVideo(slug)

  const [dialogState, setDialogState] = useState<{ open: boolean; editing?: YoutubeVideo }>({ open: false })
  const [formError, setFormError] = useState<string | null>(null)

  const closeDialog = () => {
    setDialogState({ open: false })
    setFormError(null)
  }

  const handleSubmit = async (data: YoutubeVideoForm) => {
    setFormError(null)
    const payload = { ...data, title: data.title?.trim() ? data.title.trim() : null }
    try {
      if (dialogState.editing) {
        await updateMutation.mutateAsync({ id: dialogState.editing.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      closeDialog()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-fog">Videos</h2>
        <Button variant="ghost" onClick={() => setDialogState({ open: true })}>
          + Add video
        </Button>
      </div>

      {isLoading && <Spinner label="Loading videos…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No videos yet" description="Add your first video to show it on your public profile." />
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.map((video) => (
            <Card key={video.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm text-bone">{video.title || video.video}</p>
                {video.title && <p className="truncate text-xs text-fog">{video.video}</p>}
                <p className="text-xs text-fog">Position {video.position}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" onClick={() => setDialogState({ open: true, editing: video })}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  loading={deleteMutation.isPending && deleteMutation.variables === video.id}
                  onClick={() => deleteMutation.mutate(video.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <VideoFormDialog
        open={dialogState.open}
        onClose={closeDialog}
        initial={dialogState.editing}
        onSubmit={handleSubmit}
        submitting={createMutation.isPending || updateMutation.isPending}
        submitError={formError}
      />
    </section>
  )
}
