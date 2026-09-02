import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createMerchItem,
  createMerchVariant,
  deleteMerchItem,
  deleteMerchVariant,
  listMerchItems,
  listMerchReservations,
  requestMerchImageUploadUrl,
  updateMerchItem,
  updateMerchReservationStatus,
  updateMerchVariant,
} from '../api/merch'
import { uploadFileToStorage } from '../api/images'
import type { MerchItemCreatePayload, MerchItemUpdatePayload, MerchSizeValue, ReservationStatusValue } from '../schemas/merch'

const itemsKeyFor = (slug?: string) => ['merch-items', slug ?? 'me']
const reservationsKeyFor = (slug?: string) => ['merch-reservations', slug ?? 'me']

export const useMerchItems = (slug?: string) =>
  useQuery({ queryKey: itemsKeyFor(slug), queryFn: () => listMerchItems(slug) })

export const useCreateMerchItem = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: MerchItemCreatePayload) => createMerchItem(data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useUpdateMerchItem = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: MerchItemUpdatePayload }) => updateMerchItem(id, data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useDeleteMerchItem = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteMerchItem(id, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

// Uploads the file to S3 first, then attaches the resulting url/key while
// creating the item — mirrors useUploadImage's two-step flow.
export const useCreateMerchItemWithImage = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ data, file }: { data: MerchItemCreatePayload; file: File | null }) => {
      if (!file) return createMerchItem(data, slug)
      const { upload_url, fields, key, public_url } = await requestMerchImageUploadUrl(file.type, slug)
      await uploadFileToStorage(upload_url, fields, file)
      return createMerchItem({ ...data, image_url: public_url, image_key: key }, slug)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useUpdateMerchItemWithImage = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data, file }: { id: number; data: MerchItemUpdatePayload; file: File | null }) => {
      if (!file) return updateMerchItem(id, data, slug)
      const { upload_url, fields, key, public_url } = await requestMerchImageUploadUrl(file.type, slug)
      await uploadFileToStorage(upload_url, fields, file)
      return updateMerchItem(id, { ...data, image_url: public_url, image_key: key }, slug)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useCreateMerchVariant = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, size, stock }: { itemId: number; size: MerchSizeValue | null; stock: number }) =>
      createMerchVariant(itemId, size, stock, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useUpdateMerchVariant = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, variantId, stock }: { itemId: number; variantId: number; stock: number }) =>
      updateMerchVariant(itemId, variantId, stock, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useDeleteMerchVariant = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ itemId, variantId }: { itemId: number; variantId: number }) =>
      deleteMerchVariant(itemId, variantId, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) }),
  })
}

export const useMerchReservations = (slug?: string) =>
  useQuery({ queryKey: reservationsKeyFor(slug), queryFn: () => listMerchReservations(slug) })

export const useUpdateMerchReservationStatus = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ReservationStatusValue }) =>
      updateMerchReservationStatus(id, status, slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: reservationsKeyFor(slug) })
      // A cancelled reservation restores stock server-side, so the items list is stale too.
      queryClient.invalidateQueries({ queryKey: itemsKeyFor(slug) })
    },
  })
}
