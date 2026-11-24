/**
 * Configuración centralizada de variables de entorno para la aplicación.
 * Todos los servicios (OCR, Batch, Reportes y Autenticación) se canalizan
 * a través de la variable única VITE_API_URL definida en los archivos .env
 * según el entorno (desarrollo o producción).
 */

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim() || ''

// Limpiar barra final
const cleanApiUrl = rawApiUrl.replace(/\/+$/, '')

export const config = {
  /** URL base única para todos los endpoints tomada desde VITE_API_URL */
  apiUrl: cleanApiUrl,

  /** Referencias de compatibilidad hacia el mismo API Gateway */
  authApiUrl: cleanApiUrl,
  ocrApiUrl: cleanApiUrl,

  /** Indica si la app está en modo desarrollo */
  isDev: import.meta.env.DEV,

  /** Versión de la aplicación */
  version: '1.0.0',
} as const
