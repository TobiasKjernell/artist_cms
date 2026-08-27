import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTourDate, deleteTourDate, listTourDates, updateTourDate } from '../api/tourdates'
import type { TourDateForm } from '../schemas/tourdate'

const keyFor = (slug?: string) => ['tour-dates', slug ?? 'me']

export const useTourDates = (slug?: string) =>
  useQuery({ queryKey: keyFor(slug), queryFn: () => listTourDates(slug) })

export const useCreateTourDate = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TourDateForm) => createTourDate(data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useUpdateTourDate = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TourDateForm> }) => updateTourDate(id, data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useDeleteTourDate = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteTourDate(id, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}
