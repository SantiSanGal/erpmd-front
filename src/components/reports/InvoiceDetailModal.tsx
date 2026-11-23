import { Receipt, Building2, Calendar, CreditCard, Hash, Copy, Check, UserCheck, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { InvoiceReportItem } from '@/types'

interface InvoiceDetailModalProps {
  invoice: InvoiceReportItem | null
  onClose: () => void
}

function formatCurrency(amount?: number): string {
  if (amount === undefined || amount === null) return '₲ 0'
  return `₲ ${Number(amount).toLocaleString('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const [copied, setCopied] = useState(false)

  if (!invoice) return null

  const copyJson = () => {
    // Excluimos rutas_imagenes y tracking_id para una vista limpia
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rutas_imagenes, tracking_id, ...cleanInvoice } = invoice
    navigator.clipboard.writeText(JSON.stringify(cleanInvoice, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const emisor = invoice.nombre_emisor || invoice.emisor || invoice.proveedor || 'Sin nombre'
  const rucEmisor = invoice.ruc_emisor || invoice.ruc || invoice.cuit || '-'
  const numero = invoice.numero_factura || invoice.numero || '-'
  const totalFactura = invoice.total_factura ?? invoice.total ?? 0
  const totalIva = invoice.total_iva ?? invoice.iva ?? 0

  return (
    <Dialog open={Boolean(invoice)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">Comprobante Fiscal</DialogTitle>
                <DialogDescription className="font-mono text-xs text-muted-foreground">
                  Factura N° {numero}
                </DialogDescription>
              </div>
            </div>
            {invoice.estado && (
              <Badge
                variant="outline"
                className={`text-xs ${
                  invoice.estado === 'COMPLETED'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                    : ''
                }`}
              >
                {String(invoice.estado)}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Datos del Emisor y Fecha */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Building2 className="size-3.5 text-primary" /> Emisor
              </span>
              <p className="font-semibold text-foreground text-sm truncate" title={emisor}>
                {emisor}
              </p>
              <p className="text-[11px] text-muted-foreground font-mono">
                RUC: {rucEmisor}
              </p>
            </div>

            <div className="rounded-xl border bg-muted/30 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Calendar className="size-3.5 text-primary" /> Emisión
              </span>
              <p className="font-semibold text-foreground text-sm font-mono">
                {invoice.fecha || 'Sin fecha'}
              </p>
              {invoice.timbrado && (
                <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                  <ShieldCheck className="size-3 text-emerald-600" />
                  Timbrado: {invoice.timbrado}
                </p>
              )}
            </div>
          </div>

          {/* Datos del Receptor si existen */}
          {(invoice.nombre_receptor || invoice.ruc_receptor) && (
            <div className="rounded-xl border bg-muted/20 p-3 space-y-1">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <UserCheck className="size-3.5 text-primary" /> Receptor / Cliente
              </span>
              <div className="flex justify-between items-center text-xs">
                <span className="font-medium text-foreground">{invoice.nombre_receptor || 'Consumidor Final'}</span>
                {invoice.ruc_receptor && (
                  <span className="font-mono text-muted-foreground">RUC: {invoice.ruc_receptor}</span>
                )}
              </div>
            </div>
          )}

          {/* Desglose de Importes e Impuestos */}
          <div className="rounded-xl border bg-card p-4 space-y-2">
            <span className="flex items-center gap-1.5 font-medium text-muted-foreground">
              <CreditCard className="size-3.5 text-primary" /> Liquidación e Impuestos
            </span>
            <div className="space-y-1.5 pt-1 divide-y text-xs">
              {invoice.exentas !== undefined && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Exentas</span>
                  <span className="font-mono font-medium">{formatCurrency(invoice.exentas)}</span>
                </div>
              )}
              {invoice.iva_5 !== undefined && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">IVA 5%</span>
                  <span className="font-mono">{formatCurrency(invoice.iva_5)}</span>
                </div>
              )}
              {invoice.iva_10 !== undefined && (
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">IVA 10%</span>
                  <span className="font-mono">{formatCurrency(invoice.iva_10)}</span>
                </div>
              )}
              <div className="flex justify-between py-1 font-medium text-foreground">
                <span className="text-muted-foreground">Total IVA Liquidado</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {formatCurrency(totalIva)}
                </span>
              </div>
              <div className="flex justify-between py-2 font-bold text-sm text-foreground">
                <span>Total Factura</span>
                <span className="text-primary font-mono text-base">
                  {formatCurrency(totalFactura)}
                </span>
              </div>
            </div>
          </div>

          {/* N° Comprobante */}
          <div className="flex items-center justify-between px-2 text-[11px] text-muted-foreground font-mono">
            <span className="flex items-center gap-1">
              <Hash className="size-3" /> N°: {numero}
            </span>
            {invoice.created_at && (
              <span>Registrado: {new Date(invoice.created_at).toLocaleString('es-AR')}</span>
            )}
          </div>
        </div>

        <div className="flex justify-between pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={copyJson}
            className="gap-1.5 text-xs text-muted-foreground"
          >
            {copied ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
            {copied ? 'Copiado al portapapeles' : 'Copiar datos'}
          </Button>

          <Button type="button" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
