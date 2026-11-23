export interface User {
  id: string
  firstName: string
  lastName: string
  username: string
  email: string
  enabled: boolean
  createdAt: string
}

export interface LoginCredentials {
  identifier: string
  password?: string
}

export interface LoginResponse {
  accessToken: string
  tokenType: string
  jti: string
  expiresIn: number
  expiresAt: string
  user: User
}

export interface LogoutResponse {
  jti: string
  revoked: boolean
  revokedAt: string
  message: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}
