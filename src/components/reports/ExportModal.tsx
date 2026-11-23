import { FileSpreadsheet, FileText, Download, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { ExportFormat } from '@/types'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  month: string
  onMonthChange: (month: string) => void
  format: ExportFormat
  onFormatChange: (format: ExportFormat) => void
  onExport: () => void
  isExporting: boolean
  error: string | null
  success: string | null
}

export function ExportModal({
  isOpen,
  onClose,
  month,
  onMonthChange,
  format,
  onFormatChange,
  onExport,
  isExporting,
  error,
  success,
}: ExportModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Download className="size-5" />
            </div>
            <div>
              <DialogTitle>Exportar Reporte de Facturas</DialogTitle>
              <DialogDescription>
                Descarga los comprobantes del mes en formato Excel o CSV
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          {/* Mensajes de feedback */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Selección de Mes */}
          <div className="space-y-1.5">
            <label htmlFor="export-month" className="text-xs font-semibold text-foreground">
              Mes a exportar
            </label>
            <Input
              id="export-month"
              type="month"
              value={month}
              onChange={(e) => onMonthChange(e.target.value)}
              className="text-sm font-medium"
              disabled={isExporting}
            />
          </div>

          {/* Selección de Formato */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Formato de exportación</label>
            <div className="grid grid-cols-2 gap-3">
              {/* Opción Excel */}
              <button
                type="button"
                onClick={() => onFormatChange('xlsx')}
                disabled={isExporting}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all outline-none ${
                  format === 'xlsx'
                    ? 'border-emerald-500 bg-emerald-500/10 text-foreground ring-2 ring-emerald-500/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                    format === 'xlsx'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-muted text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  <FileSpreadsheet className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-foreground">Microsoft Excel</p>
                  <p className="text-[10px] text-muted-foreground">Archivo .xlsx</p>
                </div>
              </button>

              {/* Opción CSV */}
              <button
                type="button"
                onClick={() => onFormatChange('csv')}
                disabled={isExporting}
                className={`group relative flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all outline-none ${
                  format === 'csv'
                    ? 'border-blue-500 bg-blue-500/10 text-foreground ring-2 ring-blue-500/20'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-lg transition-colors ${
                    format === 'csv'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-muted text-muted-foreground group-hover:text-foreground'
                  }`}
                >
                  <FileText className="size-5" />
                </div>
                <div>
                  <p className="font-semibold text-xs text-foreground">Valores CSV</p>
                  <p className="text-[10px] text-muted-foreground">Archivo .csv</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={onExport}
            disabled={isExporting || !month}
            className="gap-2 font-medium"
          >
            {isExporting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generando descarga…
              </>
            ) : (
              <>
                <Download className="size-4" />
                Descargar {format.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
