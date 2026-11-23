import { authClient } from '@/api/client'
import type { LoginCredentials, LoginResponse, LogoutResponse } from '@/types/auth'

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await authClient.post<LoginResponse>('/api/v1/auth/login', {
    identifier: credentials.identifier.trim(),
    password: credentials.password ?? '',
  })
  return response.data
}

export async function logoutRequest(): Promise<LogoutResponse> {
  const response = await authClient.post<LogoutResponse>('/api/v1/auth/logout')
  return response.data
}
