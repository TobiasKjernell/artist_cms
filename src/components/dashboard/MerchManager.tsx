import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import {
  useCreateMerchItemWithImage,
  useCreateMerchVariant,
  useDeleteMerchItem,
  useDeleteMerchVariant,
  useMerchItems,
  useMerchReservations,
  useUpdateMerchItem,
  useUpdateMerchItemWithImage,
  useUpdateMerchReservationStatus,
  useUpdateMerchVariant,
} from '../../hooks/useMerch'
import {
  MERCH_SIZES,
  RESERVATION_STATUSES,
  merchItemFormSchema,
  type MerchItem,
  type MerchItemForm,
  type MerchItemUpdatePayload,
  type MerchSizeValue,
  type MerchVariant,
  type ReservationStatusValue,
} from '../../schemas/merch'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_FILE_SIZE } from '../../schemas/gallery'
import { Spinner } from '../ui/Spinner'
import { ErrorState } from '../ui/ErrorState'
import { errorMessage } from '../../lib/errors'
import { EmptyState } from '../ui/EmptyState'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Dialog } from '../ui/Dialog'
import { Field, Input } from '../ui/Field'
import { formatDate, formatPrice } from '../../lib/format'

const selectClass =
  'rounded-lg border border-hairline bg-surface px-3.5 py-2.5 text-sm text-bone outline-none transition-colors duration-150 focus:border-accent/60'

function validateFile(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return 'Must be a JPEG, PNG, WebP, or GIF image.'
  }
  if (file.size > MAX_IMAGE_FILE_SIZE) {
    return 'Must be smaller than 2MB.'
  }
  return null
}

function VariantStockRow({ item, variant, slug }: { item: MerchItem; variant: MerchVariant; slug?: string }) {
  const updateVariant = useUpdateMerchVariant(slug)
  const deleteVariant = useDeleteMerchVariant(slug)
  const [value, setValue] = useState(String(variant.stock))

  const dirty = value !== '' && Number(value) !== variant.stock
  const updating = updateVariant.isPending && updateVariant.variables?.variantId === variant.id
  const deleting = deleteVariant.isPending && deleteVariant.variables?.variantId === variant.id

  return (
    <div className="flex items-center gap-2">
      {variant.size && <span className="w-10 shrink-0 text-xs text-fog">{variant.size}</span>}
      <Input
        type="number"
        min={0}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-20 py-1.5"
      />
      <Button
        variant="ghost"
        disabled={!dirty}
        loading={updating}
        onClick={() => updateVariant.mutate({ itemId: item.id, variantId: variant.id, stock: Number(value) })}
      >
        Save
      </Button>
      <Button
        variant="danger"
        loading={deleting}
        onClick={() => deleteVariant.mutate({ itemId: item.id, variantId: variant.id })}
      >
        Remove
      </Button>
    </div>
  )
}

function AddStockRow({ item, slug }: { item: MerchItem; slug?: string }) {
  const createVariant = useCreateMerchVariant(slug)
  const [stock, setStock] = useState('0')

  return (
    <div className="flex items-center gap-2">
      <Input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} className="w-20 py-1.5" />
      <Button
        variant="ghost"
        loading={createVariant.isPending}
        onClick={() => createVariant.mutate({ itemId: item.id, size: null, stock: Number(stock) })}
      >
        Set stock
      </Button>
    </div>
  )
}

function AddSizeRow({ item, slug }: { item: MerchItem; slug?: string }) {
  const createVariant = useCreateMerchVariant(slug)
  const existingSizes = useMemo(() => new Set(item.variants.map((v) => v.size)), [item.variants])
  const available = MERCH_SIZES.filter((size) => !existingSizes.has(size))
  const [size, setSize] = useState<MerchSizeValue | ''>('')
  const [stock, setStock] = useState('0')

  if (available.length === 0) return null

  return (
    <div className="flex items-center gap-2">
      <select value={size} onChange={(event) => setSize(event.target.value as MerchSizeValue)} className={selectClass}>
        <option value="">Size…</option>
        {available.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <Input type="number" min={0} value={stock} onChange={(event) => setStock(event.target.value)} className="w-20 py-1.5" />
      <Button
        variant="ghost"
        disabled={!size}
        loading={createVariant.isPending}
        onClick={() =>
          size &&
          createVariant.mutate(
            { itemId: item.id, size, stock: Number(stock) },
            { onSuccess: () => setSize('') },
          )
        }
      >
        Add size
      </Button>
    </div>
  )
}

function ItemCard({ item, slug, onEdit }: { item: MerchItem; slug?: string; onEdit: () => void }) {
  const deleteItem = useDeleteMerchItem(slug)
  const toggleActive = useUpdateMerchItem(slug)

  return (
    <Card className="flex flex-col gap-4 p-4 sm:flex-row">
      <div className="aspect-square w-full shrink-0 overflow-hidden rounded-xl border border-hairline bg-surface sm:size-32">
        {item.image_url ? (
          <img src={item.image_url} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center text-xs text-fog">No photo</div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-bone">{item.name}</p>
            <p className="text-xs text-fog">
              {formatPrice(item.price_cents)} · {item.type === 'clothing' ? 'Clothing' : 'Misc'}
              {!item.is_active && ' · Hidden'}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            <Button variant="ghost" onClick={onEdit}>
              Edit
            </Button>
            <Button
              variant="ghost"
              loading={toggleActive.isPending && toggleActive.variables?.id === item.id}
              onClick={() => toggleActive.mutate({ id: item.id, data: { is_active: !item.is_active } })}
            >
              {item.is_active ? 'Hide' : 'Show'}
            </Button>
            <Button
              variant="danger"
              loading={deleteItem.isPending && deleteItem.variables === item.id}
              onClick={() => deleteItem.mutate(item.id)}
            >
              Delete
            </Button>
          </div>
        </div>

        {item.description && <p className="text-xs text-fog">{item.description}</p>}

        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-fog">Stock</p>
          {item.variants.map((variant) => (
            // Keyed on stock too: when stock changes from outside this row
            // (e.g. a cancelled reservation restores it), remount to pick up
            // the fresh value instead of syncing via an effect.
            <VariantStockRow key={`${variant.id}-${variant.stock}`} item={item} variant={variant} slug={slug} />
          ))}
          {item.type === 'clothing' ? (
            <AddSizeRow item={item} slug={slug} />
          ) : (
            item.variants.length === 0 && <AddStockRow item={item} slug={slug} />
          )}
        </div>
      </div>
    </Card>
  )
}

function ItemFormDialog({
  open,
  onClose,
  initial,
  onSubmit,
  submitting,
  submitError,
}: {
  open: boolean
  onClose: () => void
  initial?: MerchItem
  onSubmit: (data: MerchItemForm, file: File | null, removeImage: boolean) => void
  submitting: boolean
  submitError: string | null
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MerchItemForm>({
    resolver: zodResolver(merchItemFormSchema),
    values: initial
      ? {
          name: initial.name,
          description: initial.description ?? '',
          price: initial.price_cents / 100,
          type: initial.type,
        }
      : { name: '', description: '', price: 0, type: 'clothing' },
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)
  const [fileError, setFileError] = useState<string | null>(null)

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const close = () => {
    reset()
    setFile(null)
    setRemoveImage(false)
    setFileError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClose()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (!selected) return
    const validationError = validateFile(selected)
    if (validationError) {
      setFileError(validationError)
      setFile(null)
      return
    }
    setFileError(null)
    setFile(selected)
    setRemoveImage(false)
  }

  const displayedImage = previewUrl ?? (!removeImage ? initial?.image_url : null)

  return (
    <Dialog open={open} onClose={close} title={initial ? 'Edit item' : 'Add item'}>
      <form onSubmit={handleSubmit((data) => onSubmit(data, file, removeImage))} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {displayedImage ? (
            <div className="size-20 shrink-0 overflow-hidden rounded-xl border border-hairline">
              <img src={displayedImage} alt="" className="size-full object-cover" />
            </div>
          ) : (
            <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-hairline text-center text-[11px] text-fog">
              No photo
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <Button type="button" variant="ghost" onClick={() => inputRef.current?.click()}>
              {displayedImage ? 'Change photo' : 'Choose photo'}
            </Button>
            {displayedImage && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setFile(null)
                  setRemoveImage(true)
                  if (inputRef.current) inputRef.current.value = ''
                }}
              >
                Remove photo
              </Button>
            )}
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={handleFileChange}
          className="hidden"
        />
        {fileError && <p className="text-sm text-red-300/90">{fileError}</p>}

        <Field label="Name" error={errors.name?.message}>
          <Input hasError={Boolean(errors.name)} {...register('name')} />
        </Field>
        <Field label="Description" error={errors.description?.message}>
          <textarea
            rows={3}
            className={clsx(
              'resize-none rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-bone placeholder:text-fog/60 outline-none transition-colors duration-150 focus:border-accent/60',
              errors.description ? 'border-red-500/40' : 'border-hairline',
            )}
            {...register('description')}
          />
        </Field>
        <Field label="Price (USD)" error={errors.price?.message}>
          <Input
            type="number"
            step="0.01"
            min="0"
            hasError={Boolean(errors.price)}
            {...register('price', { valueAsNumber: true })}
          />
        </Field>
        <Field label="Type">
          {initial ? (
            <p className="py-2 text-sm text-bone-dim">
              {initial.type === 'clothing' ? 'Clothing — per-size stock' : 'Misc — single stock'}
            </p>
          ) : (
            <select className={selectClass} {...register('type')}>
              <option value="clothing">Clothing — per-size stock</option>
              <option value="misc">Misc — single stock</option>
            </select>
          )}
        </Field>

        {submitError && <p className="text-sm text-red-300/90">{submitError}</p>}
        <Button type="submit" loading={submitting} className="mt-1 w-full">
          {initial ? 'Save changes' : 'Add item'}
        </Button>
      </form>
    </Dialog>
  )
}

export function MerchManager({ slug }: { slug?: string } = {}) {
  const { data: items, isLoading, isError, error, refetch } = useMerchItems(slug)
  const {
    data: reservations,
    isLoading: reservationsLoading,
    isError: reservationsIsError,
    error: reservationsError,
    refetch: refetchReservations,
  } = useMerchReservations(slug)

  const createItem = useCreateMerchItemWithImage(slug)
  const updateItem = useUpdateMerchItemWithImage(slug)
  const updateReservation = useUpdateMerchReservationStatus(slug)

  const [dialogState, setDialogState] = useState<{ open: boolean; editing?: MerchItem }>({ open: false })
  const [formError, setFormError] = useState<string | null>(null)

  const closeDialog = () => {
    setDialogState({ open: false })
    setFormError(null)
  }

  const handleSubmit = async (data: MerchItemForm, file: File | null, removeImage: boolean) => {
    setFormError(null)
    try {
      if (dialogState.editing) {
        const payload: MerchItemUpdatePayload = {
          name: data.name,
          description: data.description || null,
          price_cents: Math.round(data.price * 100),
        }
        if (removeImage) {
          payload.image_url = null
          payload.image_key = null
        }
        await updateItem.mutateAsync({ id: dialogState.editing.id, data: payload, file })
      } else {
        await createItem.mutateAsync({
          data: {
            name: data.name,
            description: data.description || null,
            price_cents: Math.round(data.price * 100),
            type: data.type,
          },
          file,
        })
      }
      closeDialog()
    } catch (err) {
      setFormError(errorMessage(err))
    }
  }

  const variantLookup = useMemo(() => {
    const map = new Map<number, { itemName: string; size: MerchSizeValue | null }>()
    items?.forEach((item) => item.variants.forEach((variant) => map.set(variant.id, { itemName: item.name, size: variant.size })))
    return map
  }, [items])

  return (
    <section className="flex flex-col gap-12">
      <div>
        <div className="mb-5 flex items-center justify-end">
          <Button variant="ghost" onClick={() => setDialogState({ open: true })}>
            + Add item
          </Button>
        </div>

        {isLoading && <Spinner label="Loading merch…" />}
        {isError && <ErrorState error={error} onRetry={() => refetch()} />}
        {items && items.length === 0 && (
          <EmptyState title="No merch yet" description="Add your first item to sell it on your public artist page." />
        )}

        {items && items.length > 0 && (
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} slug={slug} onEdit={() => setDialogState({ open: true, editing: item })} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-5 font-display text-xl text-bone">Reservations</h2>

        {reservationsLoading && <Spinner label="Loading reservations…" />}
        {reservationsIsError && <ErrorState error={reservationsError} onRetry={() => refetchReservations()} />}
        {reservations && reservations.length === 0 && (
          <EmptyState title="No reservations yet" description="Requests to reserve merch will show up here." />
        )}

        {reservations && reservations.length > 0 && (
          <div className="flex flex-col gap-3">
            {reservations.map((reservation) => {
              const info = variantLookup.get(reservation.merch_variant_id)
              return (
                <Card key={reservation.id} className="flex flex-col justify-between gap-3 p-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-bone">
                      {info ? `${info.itemName}${info.size ? ` · ${info.size}` : ''}` : 'Unknown item'} · Qty {reservation.quantity}
                    </p>
                    <p className="text-xs text-fog">
                      {reservation.contact_email ?? reservation.contact_instagram ?? 'No contact info'} ·{' '}
                      {formatDate(reservation.created_at)}
                    </p>
                  </div>
                  <select
                    value={reservation.status}
                    onChange={(event) =>
                      updateReservation.mutate({ id: reservation.id, status: event.target.value as ReservationStatusValue })
                    }
                    className={selectClass}
                  >
                    {RESERVATION_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status[0].toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <ItemFormDialog
        open={dialogState.open}
        onClose={closeDialog}
        initial={dialogState.editing}
        onSubmit={handleSubmit}
        submitting={createItem.isPending || updateItem.isPending}
        submitError={formError}
      />
    </section>
  )
}
