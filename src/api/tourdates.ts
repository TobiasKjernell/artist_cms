import { apiFetch } from '../lib/apiClient'
import { z } from 'zod'
import { tourDateListSchema, tourDateSchema, type TourDateForm } from '../schemas/tourdate'

// When `slug` is given, these hit the admin-on-behalf-of-artist routes
// instead of the "my content" ones — used when an admin is helping an artist.
const basePath = (slug?: string) => (slug ? `/users/${encodeURIComponent(slug)}/tour-dates` : '/tour-dates')

export const listTourDates = (slug?: string) => apiFetch(basePath(slug), tourDateListSchema, { auth: true })

export const createTourDate = (data: TourDateForm, slug?: string) =>
  apiFetch(basePath(slug), tourDateSchema, { method: 'POST', body: data, auth: true })

export const updateTourDate = (id: number, data: Partial<TourDateForm>, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, tourDateSchema, { method: 'PATCH', body: data, auth: true })

export const deleteTourDate = (id: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, z.void(), { method: 'DELETE', auth: true })
