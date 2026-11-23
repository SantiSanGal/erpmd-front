import { useState, useCallback, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { uploadSingleInvoiceApi } from '@/api/single-invoice/single-invoice.api'
import type { SingleInvoiceResult } from '@/types'

export interface PreviewImage {
  id: string
  file: File
  url: string
  size: number
}

const MAX_IMAGE_SIZE = 15 * 1024 * 1024 // 15MB
const ACCEPTED_EXTENSIONS = /\.(jpe?g|png|webp|heic|heif|avif|pdf)$/i

export function useSingleInvoice() {
  const [images, setImages] = useState<PreviewImage[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  // Mutación TanStack Query para procesar la factura individual
  const mutation = useMutation<SingleInvoiceResult, Error, File[]>({
    mutationFn: (files: File[]) =>
      uploadSingleInvoiceApi({
        files,
        onProgress: (percent) => setUploadProgress(percent),
      }),
  })

  // Limpieza de URLs blob al desmontar o modificar
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [images])

  const addImages = useCallback((files: File[]) => {
    mutation.reset()
    setWarningMessage(null)

    const newItems: PreviewImage[] = []
    const rejected: string[] = []

    for (const file of files) {
      if (!ACCEPTED_EXTENSIONS.test(file.name) && !file.type.startsWith('image/')) {
        rejected.push(`${file.name} no es una imagen compatible`)
        continue
      }
      if (file.size > MAX_IMAGE_SIZE) {
        rejected.push(`${file.name} supera los 15MB`)
        continue
      }

      newItems.push({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        size: file.size,
      })
    }

    if (rejected.length > 0) {
      setWarningMessage(rejected.join('. '))
    }

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems])
    }
  }, [mutation])

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) URL.revokeObjectURL(target.url)
      return prev.filter((item) => item.id !== id)
    })
  }, [])

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => URL.revokeObjectURL(img.url))
      return []
    })
    mutation.reset()
    setWarningMessage(null)
    setUploadProgress(0)
  }, [mutation])

  const processInvoice = useCallback(async () => {
    if (images.length === 0) {
      setWarningMessage('Debes agregar al menos una imagen antes de procesar.')
      return
    }

    setUploadProgress(0)
    const files = images.map((item) => item.file)
    try {
      await mutation.mutateAsync(files)
    } catch {
      // El error se maneja en mutation.error
    }
  }, [images, mutation])

  return {
    images,
    isProcessing: mutation.isPending,
    uploadProgress,
    result: mutation.data ?? null,
    error: mutation.error?.message ?? null,
    warningMessage,
    addImages,
    removeImage,
    clearAll,
    processInvoice,
    setWarningMessage,
  }
}
