import { z } from 'zod'

export const galleryImageSchema = z.object({
  id: z.number(),
  url: z.string(),
  key: z.string(),
  position: z.number(),
  user_id: z.number(),
})
export type GalleryImage = z.infer<typeof galleryImageSchema>
export const galleryImageListSchema = z.array(galleryImageSchema)

// The image record is created from an uploaded file's resulting CDN url and
// S3 key — there's no user-typed form for it anymore.
export type GalleryImageForm = {
  url: string
  key: string
}

export const imageUploadResponseSchema = z.object({
  upload_url: z.string(),
  fields: z.record(z.string(), z.string()),
  key: z.string(),
  public_url: z.string(),
})
export type ImageUploadResponse = z.infer<typeof imageUploadResponseSchema>

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
export const MAX_IMAGE_FILE_SIZE = 2 * 1024 * 1024 // 2MB — matches the hard cap S3 enforces server-side
