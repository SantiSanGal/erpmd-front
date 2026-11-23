/**
 * Configuración centralizada de variables de entorno para la aplicación.
 * Todos los servicios (OCR, Batch, Reportes y Autenticación) se canalizan
 * a través del API Gateway único en VITE_API_URL.
 */

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || 'http://localhost:8080'

// Limpiar barra final
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '')

export const config = {
  /** URL base única para todos los endpoints a través del API Gateway */
  apiUrl: cleanApiUrl,

  /** Referencias de compatibilidad hacia el mismo API Gateway */
  authApiUrl: cleanApiUrl,
  ocrApiUrl: cleanApiUrl,

  /** Indica si la app está en modo desarrollo */
  isDev: import.meta.env.DEV,

  /** Versión de la aplicación */
  version: '1.0.0',
} as const
