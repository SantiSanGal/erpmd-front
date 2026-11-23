import { useMutation } from '@tanstack/react-query'
import { logoutRequest } from '@/api/auth/auth.api'
import { getApiErrorMessage } from '@/api/client'
import type { LogoutResponse } from '@/types/auth'

export function useLogoutMutation() {
  return useMutation<LogoutResponse, Error, void>({
    mutationFn: async () => {
      try {
        return await logoutRequest()
      } catch (err) {
        const msg = getApiErrorMessage(err, 'Error al cerrar sesión en el servidor.')
        throw new Error(msg, { cause: err })
      }
    },
  })
}
