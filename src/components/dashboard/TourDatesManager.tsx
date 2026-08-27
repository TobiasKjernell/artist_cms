import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreateTourDate,
  useDeleteTourDate,
  useTourDates,
  useUpdateTourDate,
} from '../../hooks/useTourDates'
import { tourDateFormSchema, type TourDate, type TourDateForm } from '../../schemas/tourdate'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { errorMessage } from '../../lib/errors'
import { EmptyState } from '../ui/EmptyState'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input } from '../ui/Field'
import { formatDate, formatDateTimeLocalInput } from '../../lib/format'

function TourDateFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  submitting,
  submitError,
}: {
  open: boolean
  onClose: () => void
  initial?: TourDate
  onSubmit: (data: TourDateForm) => void
  submitting: boolean
  submitError: string | null
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TourDateForm>({
    resolver: zodResolver(tourDateFormSchema),
    values: initial
      ? {
          date: formatDateTimeLocalInput(initial.date),
          location: initial.location,
          venue: initial.venue,
          tickets_state: initial.tickets_state,
          tickets_url: initial.tickets_url,
        }
      : { date: '', location: '', venue: '', tickets_state: true, tickets_url: '' },
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title={initial ? 'Edit tour date' : 'Add tour date'}
    >
      <form onSubmit={handleSubmit((data) => onSubmit(data))} className="flex flex-col gap-4">
        <Field label="Date & time" error={errors.date?.message}>
          <Input type="datetime-local" hasError={Boolean(errors.date)} {...register('date')} />
        </Field>
        <Field label="Venue" error={errors.venue?.message}>
          <Input hasError={Boolean(errors.venue)} {...register('venue')} />
        </Field>
        <Field label="Location" error={errors.location?.message}>
          <Input placeholder="City, Country" hasError={Boolean(errors.location)} {...register('location')} />
        </Field>
        <Field label="Tickets URL" error={errors.tickets_url?.message}>
          <Input placeholder="https://…" hasError={Boolean(errors.tickets_url)} {...register('tickets_url')} />
        </Field>
        <label className="flex items-center gap-2 text-sm text-bone-dim">
          <input type="checkbox" className="size-4 accent-accent" {...register('tickets_state')} />
          Tickets available
        </label>
        {submitError && <p className="text-sm text-red-300/90">{submitError}</p>}
        <Button type="submit" loading={submitting} className="mt-1 w-full">
          {initial ? 'Save changes' : 'Add tour date'}
        </Button>
      </form>
    </Dialog>
  )
}

export function TourDatesManager({ slug }: { slug?: string } = {}) {
  const { data, isLoading, isError, error, refetch } = useTourDates(slug)
  const createMutation = useCreateTourDate(slug)
  const updateMutation = useUpdateTourDate(slug)
  const deleteMutation = useDeleteTourDate(slug)

  const [dialogState, setDialogState] = useState<{ open: boolean; editing?: TourDate }>({ open: false })
  const [formError, setFormError] = useState<string | null>(null)

  const closeDialog = () => {
    setDialogState({ open: false })
    setFormError(null)
  }

  const handleSubmit = async (data: TourDateForm) => {
    setFormError(null)
    const payload = { ...data, date: new Date(data.date).toISOString() }
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
      <div className="mb-5 flex items-center justify-end">
        <Button variant="ghost" onClick={() => setDialogState({ open: true })}>
          + Add tour date
        </Button>
      </div>

      {isLoading && <Spinner label="Loading tour dates…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No tour dates yet" description="Add your first date to show it on your public profile." />
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.map((td) => (
            <Card key={td.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-sm text-bone">
                  {td.venue} · {td.location}
                </p>
                <p className="text-xs text-fog">
                  {formatDate(td.date)} · {td.tickets_state ? 'Tickets on sale' : 'Sold out'}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button variant="ghost" onClick={() => setDialogState({ open: true, editing: td })}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  loading={deleteMutation.isPending && deleteMutation.variables === td.id}
                  onClick={() => deleteMutation.mutate(td.id)}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <TourDateFormDialog
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
