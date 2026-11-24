import { z } from 'zod'
import { apiFetch } from '../lib/apiClient'
import { pressAccessListSchema, pressAccessSchema } from '../schemas/press'

// With `slug`, hits the admin-on-behalf-of-artist routes.
const basePath = (slug?: string) => (slug ? `/users/${encodeURIComponent(slug)}/press` : '/press')

export const listPressAccess = (slug?: string) => apiFetch(basePath(slug), pressAccessListSchema, { auth: true })

export const createPressAccess = (data: { name: string; password: string }, slug?: string) =>
  apiFetch(basePath(slug), pressAccessSchema, { method: 'POST', body: data, auth: true })

export const updatePressAccess = (
  id: number,
  data: { name?: string; password?: string; is_blocked?: boolean },
  slug?: string,
) => apiFetch(`${basePath(slug)}/${id}`, pressAccessSchema, { method: 'PATCH', body: data, auth: true })

export const deletePressAccess = (id: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, z.void(), { method: 'DELETE', auth: true })
