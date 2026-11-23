import { useState, useCallback, useMemo } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getInvoicesByMonthApi, exportInvoicesApi, type ExportInvoicesParams } from '@/api/reports/reports.api'
import type { InvoiceReportItem, ExportFormat, MonthSummary } from '@/types'

const EMPTY_INVOICES: InvoiceReportItem[] = []

/**
 * Obtiene el mes actual en formato YYYY-MM
 */
export function getCurrentMonth(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * Calcula el mes anterior o posterior en formato YYYY-MM respetando un límite máximo
 */
export function shiftMonthWithMax(current: string, offset: number, maxMonth: string): string {
  const [yearStr, monthStr] = current.split('-')
  const date = new Date(Number(yearStr), Number(monthStr) - 1 + offset, 1)
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const calculated = `${y}-${m}`

  // Si intentamos avanzar más allá del mes actual, lo bloqueamos en el mes actual
  if (calculated > maxMonth) {
    return maxMonth
  }
  return calculated
}

export function useReports() {
  const currentMonth = useMemo(() => getCurrentMonth(), [])
  const [selectedMonth, setSelectedMonthState] = useState<string>(currentMonth)
  const [searchQuery, setSearchQuery] = useState('')

  // Estado para el modal de exportación
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [exportMonth, setExportMonthState] = useState<string>(currentMonth)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx')
  const [exportSuccess, setExportSuccess] = useState<string | null>(null)

  // Setter seguro para el mes que no permite fechas futuras
  const setSelectedMonth = useCallback(
    (month: string) => {
      if (month > currentMonth) {
        setSelectedMonthState(currentMonth)
      } else {
        setSelectedMonthState(month)
      }
    },
    [currentMonth]
  )

  const setExportMonth = useCallback(
    (month: string) => {
      if (month > currentMonth) {
        setExportMonthState(currentMonth)
      } else {
        setExportMonthState(month)
      }
    },
    [currentMonth]
  )

  // Query TanStack Query para obtener las facturas del mes
  const invoicesQuery = useQuery<InvoiceReportItem[], Error>({
    queryKey: ['invoices', selectedMonth],
    queryFn: () => getInvoicesByMonthApi(selectedMonth),
  })

  // Mutación TanStack Query para exportar a Excel / CSV
  const exportMutation = useMutation<void, Error, ExportInvoicesParams>({
    mutationFn: (params) => exportInvoicesApi(params),
    onSuccess: (_, variables) => {
      setExportSuccess(`¡Reporte ${variables.formato.toUpperCase()} descargado con éxito!`)
      setTimeout(() => {
        setIsExportModalOpen(false)
        setExportSuccess(null)
      }, 1500)
    },
  })

  const invoices = invoicesQuery.data ?? EMPTY_INVOICES

  // Filtrar facturas según el término de búsqueda
  const filteredInvoices = useMemo(() => {
    if (!searchQuery.trim()) return invoices

    const query = searchQuery.toLowerCase().trim()
    return invoices.filter((item) => {
      const emisor = (item.nombre_emisor || item.emisor || item.proveedor || '').toLowerCase()
      const receptor = (item.nombre_receptor || '').toLowerCase()
      const numero = (item.numero_factura || item.numero || '').toLowerCase()
      const rucEmisor = (item.ruc_emisor || item.ruc || item.cuit || '').toLowerCase()
      const timbrado = (item.timbrado || '').toLowerCase()

      return (
        emisor.includes(query) ||
        receptor.includes(query) ||
        numero.includes(query) ||
        rucEmisor.includes(query) ||
        timbrado.includes(query)
      )
    })
  }, [invoices, searchQuery])

  // Resumen métrico adaptado al modelo de facturas (Total, IVA, IVA 10, IVA 5, Exentas)
  const summary: MonthSummary = useMemo(() => {
    let totalImporte = 0
    let totalIva = 0
    let totalIva10 = 0
    let totalIva5 = 0
    let totalExentas = 0

    for (const inv of invoices) {
      totalImporte += Number(inv.total_factura ?? inv.total ?? 0)
      totalIva += Number(inv.total_iva ?? inv.iva ?? 0)
      totalIva10 += Number(inv.iva_10 ?? 0)
      totalIva5 += Number(inv.iva_5 ?? 0)
      totalExentas += Number(inv.exentas ?? 0)
    }

    return {
      mes: selectedMonth,
      totalImporte,
      totalIva,
      totalIva10,
      totalIva5,
      totalExentas,
      cantidadFacturas: invoices.length,
    }
  }, [invoices, selectedMonth])

  // Verificación de si se puede avanzar al mes siguiente
  const canGoNext = selectedMonth < currentMonth

  const handlePrevMonth = useCallback(() => {
    setSelectedMonthState((prev) => shiftMonthWithMax(prev, -1, currentMonth))
  }, [currentMonth])

  const handleNextMonth = useCallback(() => {
    if (canGoNext) {
      setSelectedMonthState((prev) => shiftMonthWithMax(prev, 1, currentMonth))
    }
  }, [canGoNext, currentMonth])

  const openExportModal = useCallback(
    (month?: string) => {
      setExportMonth(month || selectedMonth)
      exportMutation.reset()
      setExportSuccess(null)
      setIsExportModalOpen(true)
    },
    [selectedMonth, setExportMonth, exportMutation]
  )

  const handleExport = useCallback(() => {
    exportMutation.mutate({
      mes: exportMonth,
      formato: exportFormat,
    })
  }, [exportMonth, exportFormat, exportMutation])

  return {
    currentMonth,
    selectedMonth,
    setSelectedMonth,
    canGoNext,
    handlePrevMonth,
    handleNextMonth,
    invoices: filteredInvoices,
    totalRawCount: invoices.length,
    isLoading: invoicesQuery.isLoading,
    isRefetching: invoicesQuery.isRefetching,
    error: invoicesQuery.error?.message ?? null,
    searchQuery,
    setSearchQuery,
    summary,
    refresh: () => invoicesQuery.refetch(),
    // Modal de exportación
    isExportModalOpen,
    setIsExportModalOpen,
    exportMonth,
    setExportMonth,
    exportFormat,
    setExportFormat,
    isExporting: exportMutation.isPending,
    exportError: exportMutation.error?.message ?? null,
    exportSuccess,
    openExportModal,
    handleExport,
  }
}
