import { useRef } from 'react'
import {
  Layers,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  Sparkles,
  FileCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { useBatchInvoice } from '@/hooks/batch-invoice/useBatchInvoice'
import type { BatchStatus } from '@/types'

function getStatusBadge(status?: BatchStatus | string) {
  const norm = (status || '').toUpperCase()

  switch (norm) {
    case 'COMPLETED':
    case 'COMPLETADO':
    case 'EXITOSO':
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 gap-1">
          <CheckCircle2 className="size-3" /> Completado
        </Badge>
      )
    case 'PROCESSING':
    case 'EN_PROCESO':
    case 'PROCESANDO':
      return (
        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30 gap-1 animate-pulse">
          <Loader2 className="size-3 animate-spin" /> Procesando
        </Badge>
      )
    case 'FAILED':
    case 'FALLIDO':
    case 'ERROR':
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="size-3" /> Error
        </Badge>
      )
    case 'PENDING':
    case 'PENDIENTE':
    default:
      return (
        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30 gap-1">
          <Clock className="size-3" /> Pendiente
        </Badge>
      )
  }
}

export function BatchInvoicePage() {
  const {
    files,
    isUploading,
    uploadProgress,
    uploadError,
    activeBatch,
    batchStatus,
    isPolling,
    statusError,
    history,
    addFiles,
    removeFile,
    clearFiles,
    submitBatch,
    checkStatus,
    selectBatchFromHistory,
    deleteFromHistory,
  } = useBatchInvoice()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isUploading) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="gap-1 border-primary/20 bg-primary/5 text-primary text-xs">
            <Sparkles className="size-3" />
            Procesamiento en Batch
          </Badge>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Cargar Lote de Facturas
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Envía múltiples imágenes de facturas simultáneamente. El backend las encola y las procesa en segundo plano con Gemini Vision.
        </p>
      </div>

      {/* Alerta de error de subida */}
      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error al enviar el lote</AlertTitle>
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {/* Grid principal: Subida y Consulta */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Columna Izquierda: Dropzone y Archivos a Subir */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="size-4 text-muted-foreground" />
                Subir Nuevo Lote
              </CardTitle>
              <CardDescription>
                Selecciona todas las facturas que deseas procesar en este lote
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/20"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-xs">
                  <Upload className="size-7" />
                </div>

                <p className="font-heading text-base font-semibold text-foreground">
                  Arrastra las facturas del lote
                </p>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Puedes seleccionar decenas de imágenes JPG, PNG o documentos PDF.
                </p>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant="default"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="gap-1.5"
                  >
                    <Upload className="size-3.5" />
                    Seleccionar Facturas
                  </Button>
                </div>
              </div>

              {/* Progreso de subida del lote */}
              {isUploading && (
                <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="flex items-center gap-2">
                      <Loader2 className="size-3.5 animate-spin text-primary" />
                      Subiendo lote al servidor…
                    </span>
                    <span className="tabular-nums font-mono text-muted-foreground">
                      {uploadProgress}%
                    </span>
                  </div>
                  <Progress value={uploadProgress || 50} className="h-2" />
                </div>
              )}

              {/* Lista de archivos seleccionados pendientes de enviar */}
              {files.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      Archivos en cola ({files.length})
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={clearFiles}
                      disabled={isUploading}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-3 mr-1" />
                      Vaciar cola
                    </Button>
                  </div>

                  <div className="max-h-48 overflow-y-auto divide-y rounded-xl border bg-card text-xs">
                    {files.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <FileCheck className="size-3.5 text-muted-foreground shrink-0" />
                          <span className="truncate font-medium">{file.name}</span>
                          <span className="text-[11px] text-muted-foreground shrink-0">
                            ({(file.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => removeFile(idx)}
                          disabled={isUploading}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    className="w-full gap-2 font-medium"
                    onClick={submitBatch}
                    disabled={isUploading || files.length === 0}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />
                        Enviando Lote…
                      </>
                    ) : (
                      <>
                        <Upload className="size-4" />
                        Registrar Lote de {files.length} Factura(s)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Columna Derecha: Estado en Vivo del Lote Activo e Historial */}
        <div className="space-y-4">
          {/* Tarjeta de Estado del Lote */}
          {batchStatus ? (
            <Card className="border-primary/30 shadow-md">
              <CardHeader className="bg-primary/5 border-b pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Lote en Seguimiento
                  </span>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(batchStatus.estado)}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => checkStatus(batchStatus.batch_id)}
                      title="Refrescar estado ahora"
                      aria-label="Refrescar estado"
                    >
                      <RefreshCw className={`size-3.5 ${isPolling ? 'animate-spin text-primary' : ''}`} />
                    </Button>
                  </div>
                </div>

                <CardTitle className="text-base font-mono mt-1 break-all">
                  {batchStatus.batch_id}
                </CardTitle>
                <CardDescription className="text-xs">
                  {batchStatus.timestamp ? new Date(batchStatus.timestamp).toLocaleString('es-AR') : 'Registrado'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 text-xs">
                {/* Mensaje del backend */}
                {batchStatus.mensaje && (
                  <div className="rounded-xl border bg-muted/40 p-3 leading-relaxed text-muted-foreground">
                    <p className="font-medium text-foreground mb-0.5">Mensaje del sistema:</p>
                    {batchStatus.mensaje}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-lg border bg-card p-2.5">
                    <p className="text-[11px] text-muted-foreground">Total Facturas</p>
                    <p className="text-lg font-bold tabular-nums text-foreground">
                      {batchStatus.total_facturas ?? 1}
                    </p>
                  </div>
                  <div className="rounded-lg border bg-card p-2.5">
                    <p className="text-[11px] text-muted-foreground">Tracking ID</p>
                    <p className="text-xs font-mono truncate text-foreground" title={batchStatus.tracking_id}>
                      {batchStatus.tracking_id?.slice(0, 8)}…
                    </p>
                  </div>
                </div>

                {/* IDs de facturas generadas */}
                {Array.isArray(batchStatus.factura_ids) && batchStatus.factura_ids.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-semibold text-foreground">
                      IDs de Comprobantes ({batchStatus.factura_ids.length}):
                    </p>
                    <div className="max-h-28 overflow-y-auto space-y-1 rounded-lg border bg-muted/20 p-2 font-mono text-[11px]">
                      {batchStatus.factura_ids.map((id, index) => (
                        <div key={index} className="truncate text-muted-foreground">
                          • {id}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indicador de polling en vivo */}
                {isPolling && (
                  <div className="flex items-center gap-2 text-[11px] text-blue-600 dark:text-blue-400">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
                      <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
                    </span>
                    Actualizando estado automáticamente cada 3.5 segundos…
                  </div>
                )}

                {statusError && (
                  <p className="text-[11px] text-destructive">{statusError}</p>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed bg-muted/10">
              <CardContent className="py-8 text-center text-xs text-muted-foreground space-y-2">
                <Clock className="size-8 mx-auto text-muted-foreground/60" />
                <p className="font-medium text-foreground">Ningún lote seleccionado</p>
                <p>Sube un lote nuevo o selecciona uno de tu historial para ver su estado de procesamiento.</p>
              </CardContent>
            </Card>
          )}

          {/* Historial de Lotes Guardados */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Historial de Lotes</CardTitle>
                <Badge variant="secondary" className="text-[10px]">
                  {history.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2 text-center">
                  Aún no has registrado ningún lote en esta sesión.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {history.map((item) => (
                    <div
                      key={item.batch_id}
                      onClick={() => selectBatchFromHistory(item)}
                      className={`group flex items-center justify-between rounded-xl border p-2.5 text-xs transition-colors cursor-pointer hover:bg-muted/50 ${
                        activeBatch?.batch_id === item.batch_id ? 'border-primary bg-primary/5' : 'bg-card'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium truncate max-w-[130px]">
                            {item.batch_id.slice(0, 13)}…
                          </span>
                          {getStatusBadge(item.estado)}
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-AR') : ''} ·{' '}
                          {item.total_facturas} factura(s)
                        </p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteFromHistory(item.batch_id)
                          }}
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                          aria-label="Eliminar del historial"
                        >
                          <Trash2 className="size-3" />
                        </Button>
                        <ChevronRight className="size-3.5 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
