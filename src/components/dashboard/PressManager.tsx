import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useCreatePressAccess,
  useDeletePressAccess,
  usePressAccess,
  useUpdatePressAccess,
} from '../../hooks/usePress'
import { pressAccessFormSchema, type PressAccessForm } from '../../schemas/press'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { EmptyState } from '../ui/EmptyState'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { Dialog } from '../ui/Dialog'
import { Icon } from '../ui/Icon'
import { Field, Input } from '../ui/Field'
import { errorMessage } from '../../lib/errors'

function PressFormDialog({
  open,
  onClose,
  onSubmit,
  submitting,
  submitError,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (data: PressAccessForm) => void
  submitting: boolean
  submitError: string | null
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PressAccessForm>({ resolver: zodResolver(pressAccessFormSchema) })

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset()
        onClose()
      }}
      title="Add press access"
    >
      <form
        onSubmit={handleSubmit(async (data) => {
          await onSubmit(data)
        })}
        className="flex flex-col gap-4"
      >
        <Field label="Name / record label" error={errors.name?.message}>
          <Input placeholder="e.g. Sony Music" hasError={Boolean(errors.name)} {...register('name')} />
        </Field>
        <Field label="Password" error={errors.password?.message}>
          <Input type="text" autoComplete="off" hasError={Boolean(errors.password)} {...register('password')} />
        </Field>
        {submitError && <p className="text-sm text-danger">{submitError}</p>}
        <Button type="submit" loading={submitting} className="mt-1 w-full">
          Add access
        </Button>
      </form>
    </Dialog>
  )
}

export function PressManager({ slug }: { slug?: string } = {}) {
  const { data, isLoading, isError, error, refetch } = usePressAccess(slug)
  const createMutation = useCreatePressAccess(slug)
  const updateMutation = useUpdatePressAccess(slug)
  const deleteMutation = useDeletePressAccess(slug)

  const [open, setOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const closeDialog = () => {
    setOpen(false)
    setFormError(null)
  }

  const handleCreate = async (form: PressAccessForm) => {
    setFormError(null)
    try {
      await createMutation.mutateAsync(form)
      closeDialog()
    } catch (e) {
      setFormError(errorMessage(e))
    }
  }

  const run = async (action: Promise<unknown>) => {
    setActionError(null)
    try {
      await action
    } catch (e) {
      setActionError(errorMessage(e))
    }
  }

  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-3">
        <p className="text-sm text-fog">
          Each label gets its own password for your press site. Block someone to lock them out until you unblock them.
        </p>
        <Button onClick={() => setOpen(true)} className="shrink-0">
          <Icon name="plus" />
          Add access
        </Button>
      </div>

      {actionError && <p className="mb-4 text-sm text-danger">{actionError}</p>}

      {isLoading && <Spinner label="Loading press access…" />}
      {isError && <ErrorState error={error} onRetry={() => refetch()} />}
      {data && data.length === 0 && (
        <EmptyState title="No press access yet" description="Add a label and password to let them into your press site." />
      )}

      {data && data.length > 0 && (
        <div className="flex flex-col gap-3">
          {data.map((entry) => (
            <Card key={entry.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
                <p className="truncate text-sm text-bone">{entry.name}</p>
                <Badge tone={entry.is_blocked ? 'warn' : 'good'}>{entry.is_blocked ? 'Blocked' : 'Active'}</Badge>
              </div>
              <div className="ml-auto flex gap-2 sm:shrink-0">
                <Button
                  variant="ghost"
                  loading={updateMutation.isPending && updateMutation.variables?.id === entry.id}
                  onClick={() =>
                    run(updateMutation.mutateAsync({ id: entry.id, data: { is_blocked: !entry.is_blocked } }))
                  }
                >
                  {entry.is_blocked ? 'Unblock' : 'Block'}
                </Button>
                <Button
                  variant="danger"
                  loading={deleteMutation.isPending && deleteMutation.variables === entry.id}
                  onClick={() => {
                    if (confirm(`Remove ${entry.name}? This can't be undone.`)) run(deleteMutation.mutateAsync(entry.id))
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <PressFormDialog
        open={open}
        onClose={closeDialog}
        onSubmit={handleCreate}
        submitting={createMutation.isPending}
        submitError={formError}
      />
    </section>
  )
}
