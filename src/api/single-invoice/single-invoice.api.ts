import { ocrClient, getApiErrorMessage } from '../client'
import type { SingleInvoiceResult } from '@/types'

export interface UploadSingleInvoiceParams {
  files: File[]
  onProgress?: (percent: number) => void
}

/**
 * API call para la carga y extracción instantánea de una factura individual.
 * Endpoint: POST /api/ocr/facturas/instantaneo
 */
export async function uploadSingleInvoiceApi({
  files,
  onProgress,
}: UploadSingleInvoiceParams): Promise<SingleInvoiceResult> {
  if (files.length === 0) {
    throw new Error('Debes seleccionar al menos una imagen de la factura.')
  }

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('imagenes', file)
  })

  try {
    const response = await ocrClient.post<SingleInvoiceResult>(
      '/api/ocr/facturas/instantaneo',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded / event.total) * 100)
            onProgress?.(percent)
          }
        },
      }
    )
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'No se pudo procesar la factura individual.'), {
      cause: error,
    })
  }
}
