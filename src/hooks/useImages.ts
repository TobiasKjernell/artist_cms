import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createImage, deleteImage, listImages, requestImageUploadUrl, updateImagePosition, uploadFileToStorage } from '../api/images'

const keyFor = (slug?: string) => ['images', slug ?? 'me']

export const useImages = (slug?: string) => useQuery({ queryKey: keyFor(slug), queryFn: () => listImages(slug) })

export const useUploadImage = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (file: File) => {
      const { upload_url, fields, key, public_url } = await requestImageUploadUrl(file.type, slug)
      await uploadFileToStorage(upload_url, fields, file)
      return createImage({ url: public_url, key }, slug)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useDeleteImage = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteImage(id, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useReorderImages = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (changes: { id: number; position: number }[]) =>
      Promise.all(changes.map((change) => updateImagePosition(change.id, change.position, slug))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}
