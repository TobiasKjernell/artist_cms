import { z } from 'zod'

export const MERCH_TYPES = ['clothing', 'misc'] as const
export type MerchTypeValue = (typeof MERCH_TYPES)[number]

export const MERCH_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const
export type MerchSizeValue = (typeof MERCH_SIZES)[number]

// Cancelling isn't a status transition — it deletes the reservation and
// restores its stock (see cancelMerchReservation), so it can't be toggled
// back and forth and double-credit stock. "cancelled" only appears here so
// the dropdown can offer it as a trigger for that confirm-and-delete flow.
export const EDITABLE_RESERVATION_STATUSES = ['pending', 'contacted', 'fulfilled'] as const
export const RESERVATION_STATUSES = [...EDITABLE_RESERVATION_STATUSES, 'cancelled'] as const
export type ReservationStatusValue = (typeof RESERVATION_STATUSES)[number]
export type EditableReservationStatusValue = (typeof EDITABLE_RESERVATION_STATUSES)[number]

export const merchVariantSchema = z.object({
  id: z.number(),
  merch_item_id: z.number(),
  size: z.enum(MERCH_SIZES).nullable(),
  stock: z.number(),
})
export type MerchVariant = z.infer<typeof merchVariantSchema>

export const merchItemSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price_cents: z.number(),
  type: z.enum(MERCH_TYPES),
  image_url: z.string().nullable(),
  image_key: z.string().nullable(),
  position: z.number(),
  is_active: z.boolean(),
  variants: z.array(merchVariantSchema),
})
export type MerchItem = z.infer<typeof merchItemSchema>
export const merchItemListSchema = z.array(merchItemSchema)

// Form for the add/edit item dialog — price is entered in dollars and
// converted to price_cents before hitting the API.
export const merchItemFormSchema = z.object({
  name: z.string().min(1, 'Required').max(200, 'Must be at most 200 characters'),
  description: z.string().max(2000, 'Must be at most 2000 characters'),
  price: z.number().min(0, 'Must be 0 or more'),
  type: z.enum(MERCH_TYPES),
})
export type MerchItemForm = z.infer<typeof merchItemFormSchema>

export type MerchItemCreatePayload = {
  name: string
  description: string | null
  price_cents: number
  type: MerchTypeValue
  image_url?: string | null
  image_key?: string | null
}

export type MerchItemUpdatePayload = Partial<MerchItemCreatePayload> & { is_active?: boolean }

export const merchReservationSchema = z.object({
  id: z.number(),
  merch_variant_id: z.number(),
  user_id: z.number(),
  contact_email: z.string().nullable(),
  contact_instagram: z.string().nullable(),
  quantity: z.number(),
  status: z.enum(RESERVATION_STATUSES),
  created_at: z.string(),
})
export type MerchReservation = z.infer<typeof merchReservationSchema>
export const merchReservationListSchema = z.array(merchReservationSchema)
