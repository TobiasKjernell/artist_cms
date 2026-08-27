import { ApiError } from './apiClient'

export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (typeof error.detail === 'string') return error.detail
    if (Array.isArray(error.detail)) {
      return error.detail.map((d) => d?.msg ?? JSON.stringify(d)).join(', ')
    }
    return error.message
  }
  if (error instanceof Error) return error.message
  return 'Something went wrong.'
}
