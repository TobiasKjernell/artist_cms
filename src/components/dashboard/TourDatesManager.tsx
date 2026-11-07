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
import { Badge } from '../ui/Badge'
import { Icon } from '../ui/Icon'
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
        <label className="flex cursor-pointer items-center gap-2 text-sm text-bone-dim">
          <input type="checkbox" className="size-4 cursor-pointer accent-accent" {...register('tickets_state')} />
          Tickets available
        </label>
        {submitError && <p className="text-sm text-danger">{submitError}</p>}
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-fog">{data ? `${data.length} ${data.length === 1 ? 'date' : 'dates'}` : ''}</p>
        <Button onClick={() => setDialogState({ open: true })}>
          <Icon name="plus" />
          Add tour date
        </Button>
      </div>

      {isLoading && <Spinner label="Loading tour dates…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No tour dates yet" description="Add your first date to show it on your public profile." />
      )}

      {data && data.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead>
              <tr className="border-b border-hairline bg-surface-raised text-fog">
                <th className="px-4 py-2.5 font-medium">Date</th>
                <th className="px-4 py-2.5 font-medium">Venue</th>
                <th className="px-4 py-2.5 font-medium">Location</th>
                <th className="px-4 py-2.5 font-medium">Tickets</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {data.map((td) => (
                <tr key={td.id} className="border-b border-hairline/60 last:border-0 hover:bg-surface-raised">
                  <td className="whitespace-nowrap px-4 py-3 tabular-nums text-bone-dim">{formatDate(td.date)}</td>
                  <td className="px-4 py-3 text-bone">{td.venue}</td>
                  <td className="px-4 py-3 text-bone-dim">{td.location}</td>
                  <td className="px-4 py-3">
                    <Badge tone={td.tickets_state ? 'good' : 'muted'}>{td.tickets_state ? 'On sale' : 'Sold out'}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
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
