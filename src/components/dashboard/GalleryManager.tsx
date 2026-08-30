import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useDeleteImage, useImages, useReorderImages, useUploadImage } from '../../hooks/useImages'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE, type GalleryImage } from '../../schemas/gallery'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { errorMessage } from '../../lib/errors'
import { EmptyState } from '../ui/EmptyState'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'

function validateFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'Must be a JPEG, PNG, WebP, or GIF image.'
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return 'Must be smaller than 2MB.'
  }
  return null
}

function UploadDialog({
  open,
  onClose,
  onUpload,
  uploading,
  uploadError,
}: {
  open: boolean
  onClose: () => void
  onUpload: (file: File) => void
  uploading: boolean
  uploadError: string | null
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const close = () => {
    setFile(null)
    setLocalError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    const validationError = validateFile(selected)
    if (validationError) {
      setLocalError(validationError)
      setFile(null)
      return
    }
    setLocalError(null)
    setFile(selected)
  }

  return (
    <Dialog open={open} onClose={close} title="Add photo">
      <div className="flex flex-col gap-4">
        {previewUrl ? (
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-hairline">
            <img src={previewUrl} alt="" className="size-full object-cover" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-hairline text-center text-sm text-fog transition-colors hover:border-hairline-strong hover:text-bone-dim"
          >
            <span>Click to choose a photo</span>
            <span className="px-6 text-xs">JPEG, PNG, WebP, or GIF — up to 2MB</span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />

        {file && (
          <Button variant="ghost" onClick={() => inputRef.current?.click()}>
            Choose a different photo
          </Button>
        )}

        {(localError || uploadError) && <p className="text-sm text-red-300/90">{localError || uploadError}</p>}

        <Button disabled={!file} loading={uploading} onClick={() => file && onUpload(file)} className="w-full">
          Upload photo
        </Button>
      </div>
    </Dialog>
  )
}

export function GalleryManager({ slug }: { slug?: string } = {}) {
  const { data, isLoading, isError, error, refetch } = useImages(slug)
  const uploadMutation = useUploadImage(slug)
  const deleteMutation = useDeleteImage(slug)
  const reorderMutation = useReorderImages(slug)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [reorderError, setReorderError] = useState<string | null>(null)

  // Reordering happens locally until "Save order" is clicked; null means
  // "no unsaved reorder, just mirror server data".
  const [localOrder, setLocalOrder] = useState<GalleryImage[] | null>(null)
  const order = localOrder ?? data ?? []
  const hasPendingChanges =
    localOrder !== null && data !== undefined && localOrder.some((image, index) => image.id !== data[index]?.id)

  const closeDialog = () => {
    setDialogOpen(false)
    setUploadError(null)
  }

  const handleUpload = async (file: File) => {
    setUploadError(null)
    try {
      await uploadMutation.mutateAsync(file)
      setLocalOrder(null)
      closeDialog()
    } catch (error) {
      setUploadError(errorMessage(error))
    }
  }

  const moveImage = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target], next[index]]
    setLocalOrder(next)
  }

  const handleSavePositions = async () => {
    setReorderError(null)
    const changes = order
      .map((image, index) => ({ image, position: index }))
      .filter(({ image, position }) => image.position !== position)
      .map(({ image, position }) => ({ id: image.id, position }))

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
          <Button variant="ghost" onClick={() => setDialogOpen(true)}>
            + Add photo
          </Button>
        </div>
      </div>

      {reorderError && <p className="mb-4 text-sm text-red-300/90">{reorderError}</p>}

      {isLoading && <Spinner label="Loading photos…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No photos yet" description="Add your first photo to show it on your public artist page." />
      )}

      {order.length > 0 && (
        <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-4">
          {order.map((image, index) => (
            <div key={image.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between rounded-full border border-hairline bg-surface-raised px-2 py-1.5">
                <div className="flex gap-1">
                  <button
                    type="button"
                    disabled={index === 0 || reorderMutation.isPending}
                    onClick={() => moveImage(index, -1)}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-xs text-bone-dim transition-colors hover:bg-hairline hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    disabled={index === order.length - 1 || reorderMutation.isPending}
                    onClick={() => moveImage(index, 1)}
                    className="flex size-7 cursor-pointer items-center justify-center rounded-full text-xs text-bone-dim transition-colors hover:bg-hairline hover:text-bone disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Move later"
                  >
                    →
                  </button>
                </div>
                <button
                  type="button"
                  disabled={deleteMutation.isPending && deleteMutation.variables === image.id}
                  onClick={() => deleteMutation.mutate(image.id, { onSuccess: () => setLocalOrder(null) })}
                  className="flex size-7 cursor-pointer items-center justify-center rounded-full text-red-300/80 transition-colors hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Delete photo"
                >
                  ✕
                </button>
              </div>
              <div className="aspect-square overflow-hidden rounded-xl border border-hairline bg-surface">
                <img src={image.url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
              </div>
            </div>
          ))}
        </div>
      )}

      <UploadDialog
        open={dialogOpen}
        onClose={closeDialog}
        onUpload={handleUpload}
        uploading={uploadMutation.isPending}
        uploadError={uploadError}
      />
    </section>
  )
}
