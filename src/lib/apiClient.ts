import { useAuthStore } from '../store/authStore'

const BASE_URL = import.meta.env.VITE_API_BASE_URL

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : `Request failed with status ${status}`)
    this.status = status
    this.detail = detail
  }
}

async function parseErrorDetail(response: Response): Promise<unknown> {
  try {
    const body = await response.json()
    return body?.detail ?? body
  } catch {
    return response.statusText
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  auth?: boolean
}

export async function apiFetch<T>(path: string, schema: { parse: (data: unknown) => T }, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = false } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = useAuthStore.getState().token
    if (token) headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (response.status === 401 && auth) {
    useAuthStore.getState().logout()
  }

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }

  if (response.status === 204) {
    return schema.parse(undefined)
  }

  const json = await response.json()
  return schema.parse(json)
}

export async function apiLogin(username: string, password: string): Promise<{ access_token: string; token_type: string }> {
  const form = new URLSearchParams()
  form.set('grant_type', 'password')
  form.set('username', username)
  form.set('password', password)

  const response = await fetch(`${BASE_URL}/users/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  })

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }

  return response.json()
}
