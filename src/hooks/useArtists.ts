import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createArtist,
  getArtist,
  getArtistAdmin,
  listArtistsAdmin,
  listArtistTourDates,
  listArtistYoutube,
} from '../api/artists'
import type { ArtistCreateForm } from '../schemas/artist'

export const useArtist = (slug: string) =>
  useQuery({ queryKey: ['artists', slug], queryFn: () => getArtist(slug), enabled: Boolean(slug) })

export const useArtistYoutube = (slug: string) =>
  useQuery({ queryKey: ['artists', slug, 'youtube'], queryFn: () => listArtistYoutube(slug), enabled: Boolean(slug) })

export const useArtistTourDates = (slug: string) =>
  useQuery({ queryKey: ['artists', slug, 'tour-dates'], queryFn: () => listArtistTourDates(slug), enabled: Boolean(slug) })

export const useArtistsAdmin = () => useQuery({ queryKey: ['artists-admin'], queryFn: listArtistsAdmin })

export const useArtistAdmin = (slug: string) =>
  useQuery({ queryKey: ['artists-admin', slug], queryFn: () => getArtistAdmin(slug), enabled: Boolean(slug) })

export const useCreateArtist = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: ArtistCreateForm) => createArtist(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['artists-admin'] }),
  })
}
