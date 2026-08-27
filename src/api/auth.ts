import { apiLogin } from '../lib/apiClient'

export const login = (username: string, password: string) => apiLogin(username, password)
