export type NavigationTab = 'single' | 'batch' | 'reports'

export type BatchStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'PARTIAL'

export interface SingleInvoiceResult {
  id?: string
  tracking_id?: string | null
  estado?: string
  timbrado?: string
  fecha?: string
  ruc_emisor?: string
  nombre_emisor?: string
  ruc_receptor?: string
  nombre_receptor?: string
  numero_factura?: string
  total_factura?: number
  total_iva?: number
  iva_10?: number
  iva_5?: number
  exentas?: number
  rutas_imagenes?: string[]
  error_message?: string | null
  created_at?: string
  updated_at?: string

  // Aliases por compatibilidad
  numeroFactura?: string
  numero?: string
  proveedor?: string
  emisor?: string
  ruc?: string
  cuit?: string
  total?: number
  iva?: number
  moneda?: string
  subtotal?: number
  items?: Array<{
    descripcion: string
    cantidad?: number
    precioUnitario?: number
    total?: number
  }>
  mensaje?: string
  raw?: Record<string, unknown>
  [key: string]: unknown
}

export interface BatchUploadResponse {
  tracking_id: string
  batch_id: string
  estado: BatchStatus | string
  total_facturas: number
  factura_ids: string[]
  status_url: string
  mensaje: string
  timestamp: string
}

export interface BatchStatusResponse {
  tracking_id: string
  batch_id: string
  estado: BatchStatus | string
  total_facturas: number
  procesadas?: number
  exitosas?: number
  fallidas?: number
  factura_ids?: string[]
  status_url?: string
  mensaje?: string
  timestamp?: string
  detalles?: Array<{
    id: string
    estado: string
    mensaje?: string
    datos?: Record<string, unknown>
  }>
  [key: string]: unknown
}

export interface BatchHistoryItem {
  tracking_id: string
  batch_id: string
  estado: BatchStatus | string
  total_facturas: number
  mensaje: string
  timestamp: string
  createdAt: string
  status_url?: string
  lastChecked?: string
}

/**
 * Modelo exacto de factura devuelto por el backend
 */
export interface InvoiceReportItem {
  id: string
  tracking_id: string | null
  estado: string
  timbrado?: string
  fecha: string
  ruc_emisor: string
  nombre_emisor: string
  ruc_receptor?: string
  nombre_receptor?: string
  numero_factura: string
  total_factura: number
  total_iva: number
  iva_10?: number
  iva_5?: number
  exentas?: number
  rutas_imagenes?: string[]
  error_message?: string | null
  created_at?: string
  updated_at?: string
  // aliases por compatibilidad
  emisor?: string
  proveedor?: string
  ruc?: string
  cuit?: string
  numero?: string
  total?: number
  iva?: number
}

export interface MonthSummary {
  mes: string
  totalImporte: number
  totalIva: number
  totalIva10: number
  totalIva5: number
  totalExentas: number
  cantidadFacturas: number
}

export type ExportFormat = 'xlsx' | 'csv'

export * from './auth'
