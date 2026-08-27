import { z } from 'zod'

export const tokenSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
})
export type Token = z.infer<typeof tokenSchema>

export const artistPublicSchema = z.object({
  id: z.number(),
  slug: z.string(),
  display_name: z.string(),
})
export type ArtistPublic = z.infer<typeof artistPublicSchema>

export const artistAdminSchema = z.object({
  id: z.number(),
  username: z.string(),
  slug: z.string(),
  display_name: z.string(),
  is_admin: z.boolean(),
})
export type ArtistAdmin = z.infer<typeof artistAdminSchema>
export const artistAdminListSchema = z.array(artistAdminSchema)

const slugPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/

export const artistCreateFormSchema = z.object({
  username: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Must be at most 50 characters'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .max(200, 'Must be at most 200 characters'),
  slug: z
    .string()
    .min(3, 'Must be at least 3 characters')
    .max(50, 'Must be at most 50 characters')
    .toLowerCase()
    .regex(slugPattern, 'Lowercase letters, numbers, and hyphens only'),
  display_name: z
    .string()
    .min(1, 'Required')
    .max(100, 'Must be at most 100 characters'),
})
export type ArtistCreateForm = z.infer<typeof artistCreateFormSchema>
