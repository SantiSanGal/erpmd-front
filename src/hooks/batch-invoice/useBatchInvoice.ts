import { useState, useCallback, useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { uploadBatchApi, getBatchStatusApi } from '@/api/batch-invoice/batch-invoice.api'
import type {
  BatchUploadResponse,
  BatchStatusResponse,
  BatchHistoryItem,
} from '@/types'

const STORAGE_KEY = 'facturitas_batch_history_v1'
const POLLING_INTERVAL_MS = 3500

export function useBatchInvoice() {
  const queryClient = useQueryClient()
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Lote actualmente seleccionado para seguimiento
  const [activeBatch, setActiveBatch] = useState<BatchUploadResponse | BatchHistoryItem | null>(null)

  // Historial base de lotes guardados en localStorage
  const [history, setHistory] = useState<BatchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  // Mutación TanStack Query para subir el lote
  const uploadMutation = useMutation<BatchUploadResponse, Error, File[]>({
    mutationFn: (filesToUpload: File[]) =>
      uploadBatchApi({
        files: filesToUpload,
        onProgress: (percent) => setUploadProgress(percent),
      }),
    onSuccess: (response) => {
      setActiveBatch(response)
      setFiles([])

      const historyItem: BatchHistoryItem = {
        tracking_id: response.tracking_id,
        batch_id: response.batch_id,
        estado: response.estado,
        total_facturas: response.total_facturas,
        mensaje: response.mensaje,
        timestamp: response.timestamp,
        createdAt: new Date().toISOString(),
        status_url: response.status_url,
      }

      setHistory((prev) => [historyItem, ...prev.filter((h) => h.batch_id !== response.batch_id)])

      queryClient.setQueryData(['batchStatus', response.batch_id], {
        tracking_id: response.tracking_id,
        batch_id: response.batch_id,
        estado: response.estado,
        total_facturas: response.total_facturas,
        factura_ids: response.factura_ids,
        status_url: response.status_url,
        mensaje: response.mensaje,
        timestamp: response.timestamp,
      })
    },
    onError: (err) => {
      setUploadError(err.message)
    },
  })

  // Query TanStack Query para consultar el estado del lote en vivo
  const activeBatchId = activeBatch?.batch_id
  const statusQuery = useQuery<BatchStatusResponse, Error>({
    queryKey: ['batchStatus', activeBatchId],
    queryFn: () => getBatchStatusApi(activeBatchId!),
    enabled: Boolean(activeBatchId),
    refetchInterval: (query) => {
      const estado = (query.state.data?.estado || activeBatch?.estado || '').toUpperCase()
      const isPending = estado === 'PENDING' || estado === 'PROCESSING' || estado === 'EN_PROCESO'
      return isPending ? POLLING_INTERVAL_MS : false
    },
  })

  // Historial enriquecido reactivamente con la última información del statusQuery
  const enrichedHistory = useMemo(() => {
    if (!statusQuery.data || !activeBatchId) return history
    return history.map((item) =>
      item.batch_id === activeBatchId
        ? {
            ...item,
            estado: statusQuery.data.estado,
            total_facturas: statusQuery.data.total_facturas ?? item.total_facturas,
            lastChecked: new Date().toISOString(),
          }
        : item
    )
  }, [history, statusQuery.data, activeBatchId])

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(enrichedHistory))
    } catch {
      // ignore storage full
    }
  }, [enrichedHistory])

  // Añadir archivos para el lote
  const addFiles = useCallback((incoming: File[]) => {
    setUploadError(null)
    setFiles((prev) => [...prev, ...incoming])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const clearFiles = useCallback(() => {
    setFiles([])
    setUploadProgress(0)
    setUploadError(null)
  }, [])

  // Subir el lote
  const submitBatch = useCallback(async () => {
    if (files.length === 0) {
      setUploadError('Selecciona al menos una factura para el lote.')
      return
    }

    setUploadError(null)
    setUploadProgress(0)
    uploadMutation.mutate(files)
  }, [files, uploadMutation])

  // Consultar estado puntual / manual
  const checkStatus = useCallback(
    async (batchId: string) => {
      const found = enrichedHistory.find((h) => h.batch_id === batchId)
      if (found) {
        setActiveBatch(found)
      } else {
        setActiveBatch({
          tracking_id: batchId,
          batch_id: batchId,
          estado: 'PENDING',
          total_facturas: 1,
          mensaje: 'Consultando lote...',
          timestamp: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
      }
      return queryClient.fetchQuery({
        queryKey: ['batchStatus', batchId],
        queryFn: () => getBatchStatusApi(batchId),
      })
    },
    [enrichedHistory, queryClient]
  )

  const isPolling = Boolean(
    activeBatchId &&
      (statusQuery.data?.estado === 'PENDING' ||
        statusQuery.data?.estado === 'PROCESSING' ||
        activeBatch?.estado === 'PENDING' ||
        activeBatch?.estado === 'PROCESSING')
  )

  const selectBatchFromHistory = useCallback((item: BatchHistoryItem) => {
    setActiveBatch(item)
  }, [])

  const deleteFromHistory = useCallback((batchId: string) => {
    setHistory((prev) => prev.filter((b) => b.batch_id !== batchId))
    setActiveBatch((current) => (current?.batch_id === batchId ? null : current))
  }, [])

  return {
    files,
    isUploading: uploadMutation.isPending,
    uploadProgress,
    uploadError: uploadError || (uploadMutation.error?.message ?? null),
    activeBatch,
    batchStatus: statusQuery.data || (activeBatch as BatchStatusResponse | null),
    isPolling,
    statusError: statusQuery.error?.message ?? null,
    history: enrichedHistory,
    addFiles,
    removeFile,
    clearFiles,
    submitBatch,
    checkStatus,
    selectBatchFromHistory,
    deleteFromHistory,
    refetchStatus: () => statusQuery.refetch(),
  }
}
