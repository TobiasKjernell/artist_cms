import { z } from 'zod'

export const tourDateSchema = z.object({
  id: z.number(),
  date: z.string(),
  location: z.string(),
  venue: z.string(),
  tickets_state: z.boolean(),
  tickets_url: z.string(),
  user_id: z.number(),
})
export type TourDate = z.infer<typeof tourDateSchema>
export const tourDateListSchema = z.array(tourDateSchema)

export const tourDateFormSchema = z.object({
  date: z.string().min(1, 'Required'),
  location: z
    .string()
    .min(1, 'Required')
    .max(200, 'Must be at most 200 characters'),
  venue: z
    .string()
    .min(1, 'Required')
    .max(200, 'Must be at most 200 characters'),
  tickets_state: z.boolean(),
  tickets_url: z
    .string()
    .min(1, 'Required')
    .max(500, 'Must be at most 500 characters')
    .url('Must be a valid URL'),
})
export type TourDateForm = z.infer<typeof tourDateFormSchema>
