import { useState, useMemo } from 'react'
import {
  BarChart3,
  Download,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  Receipt,
  Layers,
  Eye,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Coins,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { useReports } from '@/hooks/reports/useReports'
import { ExportModal } from '@/components/reports/ExportModal'
import { InvoiceDetailModal } from '@/components/reports/InvoiceDetailModal'
import type { InvoiceReportItem } from '@/types'

const MONTHS = [
  { value: '01', label: 'Enero' },
  { value: '02', label: 'Febrero' },
  { value: '03', label: 'Marzo' },
  { value: '04', label: 'Abril' },
  { value: '05', label: 'Mayo' },
  { value: '06', label: 'Junio' },
  { value: '07', label: 'Julio' },
  { value: '08', label: 'Agosto' },
  { value: '09', label: 'Septiembre' },
  { value: '10', label: 'Octubre' },
  { value: '11', label: 'Noviembre' },
  { value: '12', label: 'Diciembre' },
]

function getMonthName(monthStr: string): string {
  const [year, monthPart] = monthStr.split('-')
  const monthIndex = Number(monthPart) - 1
  const monthLabel = MONTHS[monthIndex]?.label || monthPart
  return `${monthLabel} ${year}`
}

function formatAmount(amount?: number): string {
  if (amount === undefined || amount === null) return '0'
  return Number(amount).toLocaleString('es-PY', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function ReportsPage() {
  const {
    currentMonth,
    selectedMonth,
    setSelectedMonth,
    canGoNext,
    handlePrevMonth,
    handleNextMonth,
    invoices,
    isLoading,
    isRefetching,
    error,
    summary,
    refresh,
    // Modal de exportación
    isExportModalOpen,
    setIsExportModalOpen,
    exportMonth,
    setExportMonth,
    exportFormat,
    setExportFormat,
    isExporting,
    exportError,
    exportSuccess,
    openExportModal,
    handleExport,
  } = useReports()

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceReportItem | null>(null)

  // Separar año y mes seleccionado
  const [selectedYear, selectedMonthPart] = selectedMonth.split('-')
  const [maxYear, maxMonth] = currentMonth.split('-')
  const isCurrentYear = selectedYear === maxYear
  const maxMonthNum = Number(maxMonth)

  // Lista de años disponibles para el selector (desde el actual hacia atrás)
  const availableYears = useMemo(() => {
    const currentY = Number(maxYear)
    const minYear = Math.min(2020, Number(selectedYear) - 1)
    const list: string[] = []
    for (let y = currentY; y >= minYear; y--) {
      list.push(String(y))
    }
    return list
  }, [maxYear, selectedYear])

  const handleMonthSelect = (newMonthValue: string) => {
    setSelectedMonth(`${selectedYear}-${newMonthValue}`)
  }

  const handleYearSelect = (newYearValue: string) => {
    let targetMonth = selectedMonthPart
    // Si cambia al año actual y el mes seleccionado es futuro respecto a hoy, ajustar al mes tope
    if (newYearValue === maxYear && Number(selectedMonthPart) > maxMonthNum) {
      targetMonth = maxMonth
    }
    setSelectedMonth(`${newYearValue}-${targetMonth}`)
  }

  return (
    <div className="space-y-6">
      {/* Barra superior de Título y Botones de Acción */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5 text-primary text-xs">
              <BarChart3 className="size-3" />
              Gestión Fiscal
            </Badge>
          </div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Reporte de Facturas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Comprobantes del mes actual y anteriores. Exportación en Excel (.xlsx) y CSV (.csv).
          </p>
        </div>

        {/* Botones de acción principales */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Botón modal de exportación */}
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => openExportModal(selectedMonth)}
            className="gap-2 font-medium shadow-xs"
          >
            <Download className="size-4" />
            <span>Exportar Reporte</span>
          </Button>

          {/* Botón de refrescar */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={isLoading || isRefetching}
            className="gap-1.5"
            aria-label="Refrescar facturas"
          >
            <RefreshCw className={`size-3.5 ${isLoading || isRefetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </Button>
        </div>
      </div>

      {/* Selector de Mes y Año con tamaño fijo y navegación */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-2">
            {/* Botón mes anterior */}
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handlePrevMonth}
              title="Mes anterior"
              aria-label="Mes anterior"
            >
              <ChevronLeft className="size-4" />
            </Button>

            {/* Select de meses de shadcn con tamaño fijo (w-40) */}
            <Select value={selectedMonthPart} onValueChange={handleMonthSelect}>
              <SelectTrigger className="w-40 text-sm font-medium">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => {
                  const isFuture = isCurrentYear && Number(m.value) > maxMonthNum
                  return (
                    <SelectItem key={m.value} value={m.value} disabled={isFuture}>
                      {m.label}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            {/* Select de año de shadcn con tamaño fijo (w-24) para identificar e interactuar con el año */}
            <Select value={selectedYear} onValueChange={handleYearSelect}>
              <SelectTrigger className="w-24 text-sm font-medium">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((yr) => (
                  <SelectItem key={yr} value={yr}>
                    {yr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Botón mes siguiente (deshabilitado si ya estamos en el mes actual) */}
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={handleNextMonth}
              disabled={!canGoNext}
              title={canGoNext ? 'Mes siguiente' : `Límite alcanzado: mes actual`}
              aria-label="Mes siguiente"
              className={!canGoNext ? 'opacity-40 cursor-not-allowed' : ''}
            >
              <ChevronRight className="size-4" />
            </Button>

            {!canGoNext ? (
              <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex text-muted-foreground">
                Mes actual
              </Badge>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedMonth(currentMonth)}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
                title="Volver al mes actual"
              >
                Volver a mes actual
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Resumen del Mes: Total Facturado, Total IVA, Exentas, Comprobantes */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Factura ({getMonthName(selectedMonth)})
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Coins className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              ₲ {formatAmount(summary.totalImporte)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Importe bruto total del período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total IVA Liquidado
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Receipt className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
              ₲ {formatAmount(summary.totalIva)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {summary.totalIva10 > 0 ? `IVA 10%: ₲${formatAmount(summary.totalIva10)}` : 'Crédito fiscal detectado'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Operaciones Exentas
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <ShieldAlert className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              ₲ {formatAmount(summary.totalExentas)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Subtotal libre de IVA del período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Comprobantes
            </CardTitle>
            <div className="flex size-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Layers className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
              {summary.cantidadFacturas}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Facturas procesadas en {getMonthName(selectedMonth)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerta de Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>No se pudieron obtener las facturas del mes</AlertTitle>
          <AlertDescription className="mt-1 space-y-2">
            <p>{error}</p>
            <Button type="button" variant="outline" size="xs" onClick={refresh}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Listado de Facturas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle className="text-base">Comprobantes Registrados</CardTitle>
            <CardDescription className="text-xs">
              Listado de {getMonthName(selectedMonth)} ({invoices.length} comprobante(s))
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                setExportFormat('xlsx')
                openExportModal(selectedMonth)
              }}
              className="gap-1 text-xs hidden sm:inline-flex"
            >
              <FileSpreadsheet className="size-3 text-emerald-600" /> Excel
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => {
                setExportFormat('csv')
                openExportModal(selectedMonth)
              }}
              className="gap-1 text-xs hidden sm:inline-flex"
            >
              <FileText className="size-3 text-blue-600" /> CSV
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground space-y-2">
              <RefreshCw className="size-6 animate-spin text-primary" />
              <p className="text-xs">Cargando facturas de {getMonthName(selectedMonth)}…</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground px-4 space-y-2">
              <Receipt className="size-10 text-muted-foreground/50" />
              <p className="font-medium text-foreground text-sm">
                No se encontraron facturas para este mes
              </p>
              <p className="text-xs max-w-sm">
                Aún no hay facturas registradas en {getMonthName(selectedMonth)}. Puedes cargar nuevas desde "Cargar Factura" o "Cargar Lote".
              </p>
            </div>
          ) : (
            <>
              {/* Tabla para Escritorio / Tablets:
                  Comenzando mostrando: Fecha, Nombre Emisor, RUC, Totales IVA, Exentas y Total Factura */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-28">Fecha</TableHead>
                      <TableHead>Nombre Emisor</TableHead>
                      <TableHead className="w-32">RUC</TableHead>
                      <TableHead className="w-36">N° Factura</TableHead>
                      <TableHead className="text-right w-32">Totales IVA</TableHead>
                      <TableHead className="text-right w-32">Exentas</TableHead>
                      <TableHead className="text-right w-36">Total Factura</TableHead>
                      <TableHead className="w-16 text-center">Acción</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((inv) => {
                      const fecha = inv.fecha || '-'
                      const nombreEmisor = inv.nombre_emisor || inv.emisor || inv.proveedor || 'Sin nombre'
                      const ruc = inv.ruc_emisor || inv.ruc || inv.cuit || '-'
                      const numero = inv.numero_factura || inv.numero || '-'
                      const totalIva = inv.total_iva ?? inv.iva ?? 0
                      const exentas = inv.exentas ?? 0
                      const totalFactura = inv.total_factura ?? inv.total ?? 0

                      return (
                        <TableRow
                          key={inv.id}
                          className="cursor-pointer hover:bg-muted/40 transition-colors"
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          {/* 1. Fecha */}
                          <TableCell className="font-mono text-xs text-foreground font-medium whitespace-nowrap">
                            {fecha}
                          </TableCell>

                          {/* 2. Nombre Emisor */}
                          <TableCell className="font-medium text-foreground max-w-xs truncate" title={nombreEmisor}>
                            {nombreEmisor}
                          </TableCell>

                          {/* 3. RUC */}
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {ruc}
                          </TableCell>

                          {/* 4. N° Factura */}
                          <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                            {numero}
                          </TableCell>

                          {/* 5. Totales IVA */}
                          <TableCell className="text-right font-mono text-xs">
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                              ₲ {formatAmount(totalIva)}
                            </span>
                            {inv.iva_10 !== undefined && inv.iva_10 > 0 && (
                              <span className="block text-[10px] text-muted-foreground">
                                10%: ₲{formatAmount(inv.iva_10)}
                              </span>
                            )}
                          </TableCell>

                          {/* 6. Exentas */}
                          <TableCell className="text-right font-mono text-xs text-muted-foreground">
                            ₲ {formatAmount(exentas)}
                          </TableCell>

                          {/* 7. Total Factura */}
                          <TableCell className="text-right font-bold font-mono text-sm text-foreground whitespace-nowrap">
                            ₲ {formatAmount(totalFactura)}
                          </TableCell>

                          {/* Acción */}
                          <TableCell className="text-center">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedInvoice(inv)
                              }}
                              title="Ver detalle del comprobante"
                            >
                              <Eye className="size-3.5 text-muted-foreground hover:text-foreground" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Cards optimizadas para Smartphones / PWA Móvil */}
              <div className="divide-y md:hidden">
                {invoices.map((inv) => {
                  const fecha = inv.fecha || 'Sin fecha'
                  const nombreEmisor = inv.nombre_emisor || inv.emisor || inv.proveedor || 'Sin nombre'
                  const ruc = inv.ruc_emisor || inv.ruc || inv.cuit || '-'
                  const numero = inv.numero_factura || inv.numero || '-'
                  const totalIva = inv.total_iva ?? inv.iva ?? 0
                  const exentas = inv.exentas ?? 0
                  const totalFactura = inv.total_factura ?? inv.total ?? 0

                  return (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInvoice(inv)}
                      className="p-3.5 space-y-2 cursor-pointer active:bg-muted/40 transition-colors"
                    >
                      {/* Fila superior: Emisor y Total Factura */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-foreground truncate">{nombreEmisor}</p>
                          <p className="font-mono text-xs text-muted-foreground">RUC: {ruc}</p>
                        </div>
                        <span className="font-mono font-bold text-base text-primary shrink-0">
                          ₲ {formatAmount(totalFactura)}
                        </span>
                      </div>

                      {/* Fila intermedia: N° Factura y Fecha */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                        <span>N° {numero}</span>
                        <span>{fecha}</span>
                      </div>

                      {/* Fila inferior: IVA, Exentas y Acción */}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-border/50">
                        <div className="flex items-center gap-3">
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            IVA: ₲{formatAmount(totalIva)}
                          </span>
                          {exentas > 0 && (
                            <span className="text-muted-foreground">
                              Exentas: ₲{formatAmount(exentas)}
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-1 text-primary font-medium">
                          Ver detalle <ChevronRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de Exportación (mes y formato Excel/CSV) */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        month={exportMonth}
        onMonthChange={setExportMonth}
        format={exportFormat}
        onFormatChange={setExportFormat}
        onExport={handleExport}
        isExporting={isExporting}
        error={exportError}
        success={exportSuccess}
      />

      {/* Modal de Detalle individual */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </div>
  )
}
