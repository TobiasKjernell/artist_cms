import { apiFetch } from '../lib/apiClient'
import { z } from 'zod'
import { youtubeVideoListSchema, youtubeVideoSchema, type YoutubeVideoForm } from '../schemas/youtube'

// When `slug` is given, these hit the admin-on-behalf-of-artist routes
// instead of the "my content" ones — used when an admin is helping an artist.
const basePath = (slug?: string) => (slug ? `/users/${encodeURIComponent(slug)}/youtube` : '/youtube')

export const listYoutubeVideos = (slug?: string) => apiFetch(basePath(slug), youtubeVideoListSchema, { auth: true })

export const createYoutubeVideo = (data: YoutubeVideoForm, slug?: string) =>
  apiFetch(basePath(slug), youtubeVideoSchema, { method: 'POST', body: data, auth: true })

export const updateYoutubeVideo = (id: number, data: Partial<YoutubeVideoForm>, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, youtubeVideoSchema, { method: 'PATCH', body: data, auth: true })

export const updateYoutubeVideoPosition = (id: number, position: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, youtubeVideoSchema, { method: 'PATCH', body: { position }, auth: true })

export const deleteYoutubeVideo = (id: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, z.void(), { method: 'DELETE', auth: true })
