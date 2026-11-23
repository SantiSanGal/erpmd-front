import { ocrClient, getApiErrorMessage } from '../client'
import type { BatchUploadResponse, BatchStatusResponse } from '@/types'

export interface UploadBatchParams {
  files: File[]
  onProgress?: (percent: number) => void
}

/**
 * Carga un lote de facturas para procesamiento masivo en segundo plano.
 * Endpoint: POST /api/ocr/facturas/batch
 */
export async function uploadBatchApi({
  files,
  onProgress,
}: UploadBatchParams): Promise<BatchUploadResponse> {
  if (files.length === 0) {
    throw new Error('Debes seleccionar al menos una imagen para el lote.')
  }

  const formData = new FormData()
  files.forEach((file) => {
    formData.append('imagenes', file)
  })

  try {
    const response = await ocrClient.post<BatchUploadResponse>(
      '/api/ocr/facturas/batch',
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
    throw new Error(getApiErrorMessage(error, 'No se pudo registrar el lote de facturas.'), {
      cause: error,
    })
  }
}

/**
 * Consulta el estado de procesamiento de un lote.
 * Endpoint: GET /api/ocr/facturas/batch/{batchId}
 */
export async function getBatchStatusApi(batchId: string): Promise<BatchStatusResponse> {
  const cleanId = encodeURIComponent(batchId.trim())
  try {
    const response = await ocrClient.get<BatchStatusResponse>(
      `/api/ocr/facturas/batch/${cleanId}`
    )
    return response.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, `Error al consultar el estado del lote ${batchId}.`), {
      cause: error,
    })
  }
}
