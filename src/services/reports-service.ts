import { getInvoicesByMonthApi, exportInvoicesApi } from '@/api/reports/reports.api'
import type { ExportFormat } from '@/types'

export const reportsService = {
  getInvoicesByMonth: (mes: string) => getInvoicesByMonthApi(mes),
  exportInvoices: (mes: string, formato: ExportFormat) => exportInvoicesApi({ mes, formato }),
}
