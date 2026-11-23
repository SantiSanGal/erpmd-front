import { reportsClient, getApiErrorMessage } from '../client'
import type { InvoiceReportItem, ExportFormat } from '@/types'

/**
 * Obtiene el listado de facturas en formato JSON para un mes específico (YYYY-MM).
 * Endpoint: GET /api/ocr/facturas?mes=YYYY-MM
 */
export async function getInvoicesByMonthApi(mes: string): Promise<InvoiceReportItem[]> {
  try {
    const response = await reportsClient.get<
      InvoiceReportItem[] | { facturas?: InvoiceReportItem[]; data?: InvoiceReportItem[] }
    >('/api/ocr/facturas', {
      params: { mes },
    })

    if (Array.isArray(response.data)) {
      return response.data
    }

    if (response.data && Array.isArray(response.data.facturas)) {
      return response.data.facturas
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data
    }

    return []
  } catch (error) {
    throw new Error(getApiErrorMessage(error, `Error al cargar las facturas del mes ${mes}.`), {
      cause: error,
    })
  }
}

export interface ExportInvoicesParams {
  mes: string
  formato: ExportFormat
}

/**
 * Exporta las facturas de un mes en formato Excel (.xlsx) o CSV (.csv)
 */
export async function exportInvoicesApi({ mes, formato }: ExportInvoicesParams): Promise<void> {
  const isCsv = formato === 'csv'
  const endpoint = isCsv
    ? '/api/ocr/facturas/exportar'
    : `/api/ocr/facturas/mes/${encodeURIComponent(mes)}/exportar`

  const params = isCsv ? { mes, formato: 'csv' } : { formato: 'xlsx' }

  try {
    let response
    try {
      response = await reportsClient.get(endpoint, {
        params,
        responseType: 'blob',
      })
    } catch (firstErr) {
      if (!isCsv) {
        response = await reportsClient.get('/api/ocr/facturas/exportar', {
          params: { mes, formato: 'xlsx' },
          responseType: 'blob',
        })
      } else {
        throw firstErr
      }
    }

    const mimeType = isCsv
      ? 'text/csv;charset=utf-8;'
      : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const extension = isCsv ? 'csv' : 'xlsx'

    const blob = new Blob([response.data], { type: mimeType })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `facturas-${mes}.${extension}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, `No se pudo exportar el archivo ${formato.toUpperCase()} para ${mes}.`),
      { cause: error }
    )
  }
}
