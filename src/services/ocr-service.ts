export { uploadSingleInvoiceApi as uploadSingleInvoice } from '@/api/single-invoice/single-invoice.api'
export { uploadBatchApi as uploadBatch, getBatchStatusApi as getBatchStatus } from '@/api/batch-invoice/batch-invoice.api'

import { uploadSingleInvoiceApi } from '@/api/single-invoice/single-invoice.api'
import { uploadBatchApi, getBatchStatusApi } from '@/api/batch-invoice/batch-invoice.api'

export const ocrService = {
  uploadSingleInvoice: (files: File[], onProgress?: (p: number) => void) =>
    uploadSingleInvoiceApi({ files, onProgress }),
  uploadBatch: (files: File[], onProgress?: (p: number) => void) =>
    uploadBatchApi({ files, onProgress }),
  getBatchStatus: (batchId: string) => getBatchStatusApi(batchId),
}
