import { useMutation } from '@tanstack/react-query'
import { loginRequest } from '@/api/auth/auth.api'
import { getApiErrorMessage } from '@/api/client'
import type { LoginCredentials, LoginResponse } from '@/types/auth'

export function useLoginMutation() {
  return useMutation<LoginResponse, Error, LoginCredentials>({
    mutationFn: async (credentials) => {
      try {
        return await loginRequest(credentials)
      } catch (err) {
        const msg = getApiErrorMessage(err, 'Error al iniciar sesión.')
        throw new Error(msg, { cause: err })
      }
    },
  })
}
