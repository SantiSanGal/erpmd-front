export type InvoiceStatus = 'pending' | 'uploading' | 'success' | 'error'

export type InvoiceItem = {
  id: string
  file: File
  previewUrl: string
  status: InvoiceStatus
  progress: number
  error?: string
}
