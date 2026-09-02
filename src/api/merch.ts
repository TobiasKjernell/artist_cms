import { apiFetch } from '../lib/apiClient'
import { z } from 'zod'
import { imageUploadResponseSchema } from '../schemas/gallery'
import {
  merchItemListSchema,
  merchItemSchema,
  merchReservationListSchema,
  merchReservationSchema,
  merchVariantSchema,
  type MerchItemCreatePayload,
  type MerchItemUpdatePayload,
  type MerchSizeValue,
  type ReservationStatusValue,
} from '../schemas/merch'

// When `slug` is given, these hit the admin-on-behalf-of-artist routes
// instead of the "my content" ones — used when an admin is helping an artist.
const basePath = (slug?: string) => (slug ? `/users/${encodeURIComponent(slug)}/merch` : '/merch')

export const listMerchItems = (slug?: string) => apiFetch(basePath(slug), merchItemListSchema, { auth: true })

export const createMerchItem = (data: MerchItemCreatePayload, slug?: string) =>
  apiFetch(basePath(slug), merchItemSchema, { method: 'POST', body: data, auth: true })

export const updateMerchItem = (id: number, data: MerchItemUpdatePayload, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, merchItemSchema, { method: 'PATCH', body: data, auth: true })

export const deleteMerchItem = (id: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, z.void(), { method: 'DELETE', auth: true })

export const requestMerchImageUploadUrl = (contentType: string, slug?: string) =>
  apiFetch(`${basePath(slug)}/upload-url`, imageUploadResponseSchema, {
    method: 'POST',
    body: { content_type: contentType },
    auth: true,
  })

export const createMerchVariant = (itemId: number, size: MerchSizeValue | null, stock: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${itemId}/variants`, merchVariantSchema, {
    method: 'POST',
    body: { size, stock },
    auth: true,
  })

export const updateMerchVariant = (itemId: number, variantId: number, stock: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${itemId}/variants/${variantId}`, merchVariantSchema, {
    method: 'PATCH',
    body: { stock },
    auth: true,
  })

export const deleteMerchVariant = (itemId: number, variantId: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${itemId}/variants/${variantId}`, z.void(), { method: 'DELETE', auth: true })

export const listMerchReservations = (slug?: string) =>
  apiFetch(`${basePath(slug)}/reservations`, merchReservationListSchema, { auth: true })

export const updateMerchReservationStatus = (id: number, status: ReservationStatusValue, slug?: string) =>
  apiFetch(`${basePath(slug)}/reservations/${id}`, merchReservationSchema, {
    method: 'PATCH',
    body: { status },
    auth: true,
  })
