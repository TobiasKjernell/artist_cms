import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPressAccess, deletePressAccess, listPressAccess, updatePressAccess } from '../api/press'

const keyFor = (slug?: string) => ['press-access', slug ?? 'me']

export const usePressAccess = (slug?: string) =>
  useQuery({ queryKey: keyFor(slug), queryFn: () => listPressAccess(slug) })

export const useCreatePressAccess = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; password: string }) => createPressAccess(data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useUpdatePressAccess = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; password?: string; is_blocked?: boolean } }) =>
      updatePressAccess(id, data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useDeletePressAccess = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deletePressAccess(id, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}
