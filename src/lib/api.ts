import axios from 'axios'

export type UploadResult = {
  id?: string
  status?: string
  [key: string]: unknown
}

const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim()
const uploadPath =
  (import.meta.env.VITE_UPLOAD_PATH as string | undefined)?.trim() || '/facturas'

/**
 * Cuando no hay una API configurada la interfaz funciona en modo demo:
 * simula la subida para poder probar la experiencia completa.
 */
export const isDemoMode = !apiBaseUrl

const api = axios.create({
  baseURL: apiBaseUrl ? apiBaseUrl.replace(/\/+$/, '') : undefined,
  timeout: 60_000,
  headers: { Accept: 'application/json' },
})

export async function uploadInvoice(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  if (isDemoMode) {
    return simulateUpload(onProgress)
  }

  const formData = new FormData()
  formData.append('file', file)

  const { data } = await api.post<UploadResult>(uploadPath, formData, {
    onUploadProgress: (event) => {
      if (!event.total) return
      const percent = Math.round((event.loaded / event.total) * 100)
      onProgress?.(Math.min(percent, 100))
    },
  })

  return data
}

export function getUploadErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === 'ECONNABORTED') {
      return 'La subida tardó demasiado. Comprueba tu conexión e inténtalo de nuevo.'
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisa que la API esté disponible.'
    }

    const serverMessage = extractServerMessage(error.response.data)
    if (serverMessage) return serverMessage

    return `El servidor respondió con un error (${error.response.status}).`
  }

  if (error instanceof Error && error.message) return error.message

  return 'Ocurrió un error inesperado al subir la factura.'
}

function extractServerMessage(data: unknown): string | undefined {
  if (typeof data === 'string' && data.trim()) return data.trim()

  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>
    for (const key of ['message', 'detail', 'error']) {
      const value = record[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
    }
  }

  return undefined
}

function simulateUpload(
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve) => {
    let progress = 0

    const interval = window.setInterval(() => {
      progress = Math.min(100, progress + 12 + Math.random() * 18)
      onProgress?.(Math.round(progress))

      if (progress >= 100) {
        window.clearInterval(interval)
        window.setTimeout(() => {
          resolve({
            id: crypto.randomUUID(),
            status: 'processed',
            demo: true,
          })
        }, 250)
      }
    }, 180)
  })
}
