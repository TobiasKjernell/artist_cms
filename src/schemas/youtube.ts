import { z } from 'zod'

export const youtubeVideoSchema = z.object({
  id: z.number(),
  video: z.string(),
  // Nullable in the DB; tolerate the key being entirely absent too, since
  // older API deployments may not serialize it at all.
  title: z.string().nullable().optional(),
  position: z.number(),
  user_id: z.number(),
})
export type YoutubeVideo = z.infer<typeof youtubeVideoSchema>
export const youtubeVideoListSchema = z.array(youtubeVideoSchema)

export const youtubeVideoFormSchema = z.object({
  video: z
    .string()
    .min(1, 'Required')
    .regex(/^[a-zA-Z0-9_-]{11}$/, 'Must be an 11-character YouTube video ID'),
  title: z.string().max(200, 'Must be at most 200 characters').nullable().optional(),
  position: z.number({ error: 'Required' }).int('Must be a whole number'),
})
export type YoutubeVideoForm = z.infer<typeof youtubeVideoFormSchema>
