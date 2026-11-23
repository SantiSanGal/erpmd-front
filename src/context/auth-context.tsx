import * as React from 'react'
import { AuthContext, type AuthContextValue } from './auth-types'
import { AUTH_TOKEN_KEY, AUTH_USER_KEY } from '@/api/client'
import { useLoginMutation } from '@/hooks/auth/useLoginMutation'
import { useLogoutMutation } from '@/hooks/auth/useLogoutMutation'
import type { User, LoginCredentials } from '@/types/auth'

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = React.useState<string | null>(() => {
    try {
      return localStorage.getItem(AUTH_TOKEN_KEY)
    } catch {
      return null
    }
  })

  const [user, setUser] = React.useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY)
      return stored ? (JSON.parse(stored) as User) : null
    } catch {
      return null
    }
  })

  const loginMutation = useLoginMutation()
  const logoutMutation = useLogoutMutation()

  const clearAuth = React.useCallback(() => {
    setToken(null)
    setUser(null)
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
      localStorage.removeItem(AUTH_USER_KEY)
    } catch {
      // LocalStorage access fallback
    }
  }, [])

  const login = React.useCallback(
    async (credentials: LoginCredentials) => {
      const data = await loginMutation.mutateAsync(credentials)
      setToken(data.accessToken)
      setUser(data.user)
      try {
        localStorage.setItem(AUTH_TOKEN_KEY, data.accessToken)
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user))
      } catch {
        // LocalStorage access fallback
      }
    },
    [loginMutation]
  )

  const logout = React.useCallback(async () => {
    try {
      await logoutMutation.mutateAsync()
    } catch {
      // Procedemos a limpiar localmente aunque el servidor responda error
    } finally {
      clearAuth()
    }
  }, [logoutMutation, clearAuth])

  React.useEffect(() => {
    const onUnauthorized = () => {
      clearAuth()
    }
    window.addEventListener('facturitas:unauthorized', onUnauthorized)
    return () => {
      window.removeEventListener('facturitas:unauthorized', onUnauthorized)
    }
  }, [clearAuth])

  const isAuthenticated = Boolean(token)
  const isLoading = loginMutation.isPending || logoutMutation.isPending

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, token, isAuthenticated, isLoading, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
