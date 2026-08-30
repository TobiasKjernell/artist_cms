import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createYoutubeVideo,
  deleteYoutubeVideo,
  listYoutubeVideos,
  updateYoutubeVideo,
  updateYoutubeVideoPosition,
} from '../api/youtube'
import type { YoutubeVideoForm } from '../schemas/youtube'

const keyFor = (slug?: string) => ['youtube', slug ?? 'me']

export const useYoutubeVideos = (slug?: string) =>
  useQuery({ queryKey: keyFor(slug), queryFn: () => listYoutubeVideos(slug) })

export const useCreateYoutubeVideo = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: YoutubeVideoForm) => createYoutubeVideo(data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useUpdateYoutubeVideo = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<YoutubeVideoForm> }) => updateYoutubeVideo(id, data, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useDeleteYoutubeVideo = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteYoutubeVideo(id, slug),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}

export const useReorderYoutubeVideos = (slug?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (changes: { id: number; position: number }[]) =>
      Promise.all(changes.map((change) => updateYoutubeVideoPosition(change.id, change.position, slug))),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: keyFor(slug) }),
  })
}
