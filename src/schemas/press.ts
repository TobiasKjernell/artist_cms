import { z } from 'zod'

export const pressAccessSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_blocked: z.boolean(),
  created_at: z.string(),
})
export type PressAccess = z.infer<typeof pressAccessSchema>
export const pressAccessListSchema = z.array(pressAccessSchema)

export const pressAccessFormSchema = z.object({
  name: z.string().min(1, 'Required').max(100, 'Must be at most 100 characters'),
  password: z.string().min(6, 'Must be at least 6 characters').max(200, 'Must be at most 200 characters'),
})
export type PressAccessForm = z.infer<typeof pressAccessFormSchema>
