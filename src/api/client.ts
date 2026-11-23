import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { config } from '@/config/env'

export const AUTH_TOKEN_KEY = 'facturitas_token'
export const AUTH_USER_KEY = 'facturitas_user'

/**
 * Cliente HTTP unificado para todos los servicios de facturas y reportes
 * Configurado con la URL base parametrizada en VITE_API_URL
 */
export const apiClient = axios.create({
  baseURL: config.apiUrl,
  timeout: 120_000,
  headers: {
    Accept: 'application/json',
  },
})

/**
 * Cliente HTTP para el servicio de autenticación
 * Configurado con la URL base parametrizada en VITE_AUTH_API_URL
 */
export const authClient = axios.create({
  baseURL: config.authApiUrl,
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

// Interceptor para inyectar automáticamente el Bearer token en todas las peticiones
const attachAuthToken = (reqConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (token && reqConfig.headers) {
      reqConfig.headers.Authorization = `Bearer ${token}`
    }
  } catch {
    // Si localStorage no está disponible
  }
  return reqConfig
}

apiClient.interceptors.request.use(attachAuthToken)
authClient.interceptors.request.use(attachAuthToken)

// Interceptor de respuesta para manejar sesiones expiradas (401)
const handleUnauthorized = (error: unknown) => {
  if (axios.isAxiosError(error) && error.response?.status === 401) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('facturitas:unauthorized'))
    }
  }
  return Promise.reject(error)
}

apiClient.interceptors.response.use((res) => res, handleUnauthorized)
authClient.interceptors.response.use((res) => res, handleUnauthorized)

// Alias exportados para compatibilidad
export const ocrClient = apiClient
export const reportsClient = apiClient

/**
 * Extrae un mensaje de error legible para el usuario
 */
export function getApiErrorMessage(error: unknown, defaultMessage = 'Ocurrió un error inesperado'): string {
  if (axios.isAxiosError(error)) {
    const axiosErr = error as AxiosError<Record<string, unknown> | string>

    if (axiosErr.code === 'ECONNABORTED') {
      return 'La solicitud tardó demasiado tiempo. Verifica tu conexión.'
    }

    if (!axiosErr.response) {
      return `No se pudo conectar con el servidor (${axiosErr.config?.baseURL || config.apiUrl}). Asegúrate de que el backend esté ejecutándose.`
    }

    const data = axiosErr.response.data
    if (typeof data === 'string' && data.trim()) {
      return data.trim()
    }

    if (data && typeof data === 'object') {
      for (const key of ['mensaje', 'message', 'detail', 'error', 'description', 'error_message']) {
        const val = data[key]
        if (typeof val === 'string' && val.trim()) {
          return val.trim()
        }
      }
    }

    return `Error del servidor: HTTP ${axiosErr.response.status} (${axiosErr.response.statusText || 'Error'})`
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return defaultMessage
}
