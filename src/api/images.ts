import { apiFetch, ApiError } from '../lib/apiClient'
import { z } from 'zod'
import {
  galleryImageListSchema,
  galleryImageSchema,
  imageUploadResponseSchema,
  type GalleryImageForm,
} from '../schemas/gallery'

// When `slug` is given, these hit the admin-on-behalf-of-artist routes
// instead of the "my content" ones — used when an admin is helping an artist.
const basePath = (slug?: string) => (slug ? `/users/${encodeURIComponent(slug)}/images` : '/images')

export const listImages = (slug?: string) => apiFetch(basePath(slug), galleryImageListSchema, { auth: true })

export const createImage = (data: GalleryImageForm, slug?: string) =>
  apiFetch(basePath(slug), galleryImageSchema, { method: 'POST', body: data, auth: true })

export const updateImagePosition = (id: number, position: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, galleryImageSchema, { method: 'PATCH', body: { position }, auth: true })

export const deleteImage = (id: number, slug?: string) =>
  apiFetch(`${basePath(slug)}/${id}`, z.void(), { method: 'DELETE', auth: true })

export const requestImageUploadUrl = (contentType: string, slug?: string) =>  
  apiFetch(`${basePath(slug)}/upload-url`, imageUploadResponseSchema, {
    method: 'POST',
    body: { content_type: contentType },
    auth: true, 
  })

// Goes straight to S3 via a presigned POST — not through our API (no auth
// header, no JSON envelope). `fields` must be appended to the form BEFORE
// the file, and must all be present, or S3 rejects the whole request
// (they carry the signature and the 2MB size-cap condition).
export const uploadFileToStorage = async (uploadUrl: string, fields: Record<string, string>, file: File) => {
  const form = new FormData()
  Object.entries(fields).forEach(([key, value]) => form.append(key, value))
  form.append('file', file)

  const response = await fetch(uploadUrl, { method: 'POST', body: form })
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText)
  }
}
