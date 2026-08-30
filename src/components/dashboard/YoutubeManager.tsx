import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateYoutubeVideo,
  useDeleteYoutubeVideo,
  useReorderYoutubeVideos,
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
    values: initial ? { video: initial.video, title: initial.title ?? '' } : { video: '', title: '' },
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
      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="flex flex-col gap-4">
        <Field label="YouTube video ID" error={errors.video?.message}>
          <Input placeholder="dQw4w9WgXcQ" hasError={Boolean(errors.video)} {...register('video')} />
        </Field>
        <Field label="Song name (optional)" error={errors.title?.message}>
          <Input placeholder="e.g. Midnight Drive" hasError={Boolean(errors.title)} {...register('title')} />
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
  const reorderMutation = useReorderYoutubeVideos(slug)

  const [dialogState, setDialogState] = useState<{ open: boolean; editing?: YoutubeVideo }>({ open: false })
  const [formError, setFormError] = useState<string | null>(null)
  const [reorderError, setReorderError] = useState<string | null>(null)

  // Reordering happens locally (drag-free — just up/down) until "Save order"
  // is clicked; null means "no unsaved reorder, just mirror server data".
  const [localOrder, setLocalOrder] = useState<YoutubeVideo[] | null>(null)
  const order = localOrder ?? data ?? []
  const hasPendingChanges =
    localOrder !== null && data !== undefined && localOrder.some((video, index) => video.id !== data[index]?.id)

  const closeDialog = () => {
    setDialogState({ open: false })
    setFormError(null)
  }

  const handleSubmit = async (formData: YoutubeVideoForm) => {
    setFormError(null)
    const payload = { ...formData, title: formData.title?.trim() ? formData.title.trim() : null }
    try {
      if (dialogState.editing) {
        await updateMutation.mutateAsync({ id: dialogState.editing.id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
        setLocalOrder(null)
      }
      closeDialog()
    } catch (error) {
      setFormError(errorMessage(error))
    }
  }

  const moveVideo = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setLocalOrder(next)
  }

  const handleSavePositions = async () => {
    setReorderError(null)
    const changes = order
      .map((video, index) => ({ video, position: index }))
      .filter(({ video, position }) => video.position !== position)
      .map(({ video, position }) => ({ id: video.id, position }))

    if (changes.length === 0) return
    try {
      await reorderMutation.mutateAsync(changes)
      setLocalOrder(null)
    } catch (error) {
      setReorderError(errorMessage(error))
    }
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-xs text-fog">{hasPendingChanges ? 'Unsaved position changes' : ''}</p>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            disabled={!hasPendingChanges}
            loading={reorderMutation.isPending}
            onClick={handleSavePositions}
          >
            Save order
          </Button>
          <Button variant="ghost" onClick={() => setDialogState({ open: true })}>
            + Add video
          </Button>
        </div>
      </div>

      {reorderError && <p className="mb-4 text-sm text-red-300/90">{reorderError}</p>}

      {isLoading && <Spinner label="Loading videos…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No videos yet" description="Add your first video to show it on your public profile." />
      )}

      {order.length > 0 && (
        <div className="flex flex-col gap-3">
          {order.map((video, index) => (
            <Card key={video.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => moveVideo(index, -1)}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-hairline text-xs text-fog transition-colors hover:border-hairline-strong hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={index === order.length - 1 || reorderMutation.isPending}
                    onClick={() => moveVideo(index, 1)}
                    className="flex size-6 cursor-pointer items-center justify-center rounded-full border border-hairline text-xs text-fog transition-colors hover:border-hairline-strong hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm text-bone">{video.title || video.video}</p>
                  {video.title && <p className="truncate text-xs text-fog">{video.video}</p>}
                  <p className="text-xs text-fog">Position {index + 1}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:shrink-0 ml-auto">
                <Button variant="ghost" onClick={() => setDialogState({ open: true, editing: video })}>
                  Edit
                </Button> 
                <Button
                  variant="danger"
                  loading={deleteMutation.isPending && deleteMutation.variables === video.id}
                  onClick={() => deleteMutation.mutate(video.id, { onSuccess: () => setLocalOrder(null) })}
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
