import { apiFetch } from '../lib/apiClient'
import {
  artistAdminListSchema,
  artistAdminSchema,
  artistPublicSchema,
  type ArtistCreateForm,
} from '../schemas/artist'
import { youtubeVideoListSchema } from '../schemas/youtube'
import { tourDateListSchema } from '../schemas/tourdate'

export const getArtist = (slug: string) => apiFetch(`/artists/${encodeURIComponent(slug)}`, artistPublicSchema)

export const listArtistsAdmin = () => apiFetch('/users', artistAdminListSchema, { auth: true })

export const getArtistAdmin = (slug: string) =>
  apiFetch(`/users/${encodeURIComponent(slug)}`, artistAdminSchema, { auth: true })

export const createArtist = (data: ArtistCreateForm) =>
  apiFetch('/users', artistAdminSchema, { method: 'POST', body: data, auth: true })

export const listArtistYoutube = (slug: string) =>
  apiFetch(`/artists/${encodeURIComponent(slug)}/youtube`, youtubeVideoListSchema)

export const listArtistTourDates = (slug: string) =>
  apiFetch(`/artists/${encodeURIComponent(slug)}/tour-dates`, tourDateListSchema)
