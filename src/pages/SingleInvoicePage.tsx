import { useRef, useState, useEffect, useCallback } from 'react'
import {
  FileText,
  Camera,
  Upload,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
  Receipt,
  Building2,
  Calendar,
  CreditCard,
  Hash,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { InvoiceThumbnailCard } from '@/components/invoice-thumbnail-card'
import { CameraCaptureDialog } from '@/components/camera/CameraCaptureDialog'
import { useSingleInvoice } from '@/hooks/single-invoice/useSingleInvoice'
import { useIsMobileDevice } from '@/hooks/common/useIsMobileDevice'

export function SingleInvoicePage() {
  const {
    images,
    isProcessing,
    uploadProgress,
    result,
    error,
    warningMessage,
    addImages,
    removeImage,
    clearAll,
    processInvoice,
    setWarningMessage,
  } = useSingleInvoice()

  const isMobileDevice = useIsMobileDevice()

  const [copiedRaw, setCopiedRaw] = useState(false)
  const [showRawJson, setShowRawJson] = useState(false)
  const [isCameraOpen, setIsCameraOpen] = useState(false)

  const galleryInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleCameraCapture = (file: File) => {
    if (result) {
      clearAll()
    }
    addImages([file])
  }

  const openCamera = useCallback(() => {
    if (result) {
      clearAll()
    }
    setIsCameraOpen(true)
  }, [result, clearAll])

  // Escuchar evento para abrir la cámara desde el botón central del menú inferior
  useEffect(() => {
    const handleOpenCamEvent = () => {
      openCamera()
    }
    window.addEventListener('facturitas:open-camera', handleOpenCamEvent)
    return () => {
      window.removeEventListener('facturitas:open-camera', handleOpenCamEvent)
    }
  }, [openCamera])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addImages(Array.from(e.target.files))
      e.target.value = ''
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (isProcessing) return
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addImages(Array.from(e.dataTransfer.files))
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const formatGuarani = (amount?: number | null) => {
    if (amount === undefined || amount === null) return '₲ 0'
    return `₲ ${Number(amount).toLocaleString('es-PY', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }

  const getCleanJsonString = (data: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, tracking_id, rutas_imagenes, ...clean } = data
    return JSON.stringify(clean, null, 2)
  }

  const copyCleanJson = (data: Record<string, unknown>) => {
    navigator.clipboard.writeText(getCleanJsonString(data))
    setCopiedRaw(true)
    setTimeout(() => setCopiedRaw(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary text-xs">
            Carga Individual Instantánea
          </Badge>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Cargar Factura
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sube una o más fotos de una misma factura.
        </p>
      </div>

      {/* Alerta de advertencia o errores de archivo */}
      {warningMessage && (
        <Alert variant="destructive" className="flex items-start justify-between">
          <div className="flex items-start gap-2">
            <AlertCircle className="size-4 mt-0.5" />
            <div>
              <AlertTitle>Atención</AlertTitle>
              <AlertDescription>{warningMessage}</AlertDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setWarningMessage(null)}
          >
            Entendido
          </Button>
        </Alert>
      )}

      {/* Error de la API */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="size-4" />
          <AlertTitle>Error en el procesamiento</AlertTitle>
          <AlertDescription className="mt-1 space-y-2">
            <p>{error}</p>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={processInvoice}
              disabled={isProcessing}
            >
              <RotateCcw className="size-3 mr-1" /> Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Si ya tenemos resultado exitoso */}
      {result ? (
        <Card className="border-emerald-500/30 shadow-md">
          <CardHeader className="bg-emerald-500/5 border-b pb-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                  <CheckCircle2 className="size-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Factura Procesada con Éxito</CardTitle>
                    {result.estado && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold"
                      >
                        {result.estado}
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    Datos fiscales extraídos correctamente mediante Procesamiento
                  </CardDescription>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearAll}
                className="gap-1.5"
              >
                <RotateCcw className="size-3.5" />
                Cargar otra factura
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-6">
            {/* Grid de campos principales extraídos (sin ID ni tracking) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Emisor */}
              <div className="rounded-xl border bg-card p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Building2 className="size-3.5 text-primary" /> Emisor / Proveedor
                </span>
                <p
                  className="font-semibold text-foreground text-sm truncate"
                  title={result.nombre_emisor || result.proveedor || result.emisor || ''}
                >
                  {result.nombre_emisor || result.proveedor || result.emisor || 'No especificado'}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  RUC: {result.ruc_emisor || result.ruc || result.cuit || '-'}
                </p>
              </div>

              {/* N° Comprobante y Timbrado */}
              <div className="rounded-xl border bg-card p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Hash className="size-3.5 text-primary" /> N° de Factura
                </span>
                <p className="font-semibold text-foreground text-sm font-mono truncate">
                  {result.numero_factura || result.numeroFactura || result.numero || '-'}
                </p>
                {result.timbrado && (
                  <p className="text-[11px] text-muted-foreground font-mono flex items-center gap-1">
                    <ShieldCheck className="size-3 text-emerald-600 shrink-0" />
                    Timbrado: {result.timbrado}
                  </p>
                )}
              </div>

              {/* Fecha de Emisión */}
              <div className="rounded-xl border bg-card p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Calendar className="size-3.5 text-primary" /> Fecha de Emisión
                </span>
                <p className="font-semibold text-foreground text-sm font-mono">
                  {result.fecha || 'Sin fecha'}
                </p>
                {result.created_at && (
                  <p className="text-[11px] text-muted-foreground">
                    Registrado: {new Date(result.created_at).toLocaleDateString('es-AR')}
                  </p>
                )}
              </div>

              {/* Total Factura (Destacado) */}
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-3.5 space-y-1">
                <span className="flex items-center gap-1.5 text-xs font-medium text-primary">
                  <CreditCard className="size-3.5" /> Total Factura
                </span>
                <p className="text-xl sm:text-2xl font-bold tracking-tight text-primary font-mono">
                  {formatGuarani(result.total_factura ?? result.total)}
                </p>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Total IVA: {formatGuarani(result.total_iva ?? result.iva)}
                </p>
              </div>
            </div>

            {/* Fila secundaria: Receptor e Impuestos */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Tarjeta de Receptor / Cliente */}
              <div className="rounded-xl border bg-card p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <UserCheck className="size-3.5 text-primary" /> Receptor / Cliente
                </span>
                <div className="space-y-1 pt-1 text-xs">
                  <div className="flex justify-between py-1.5 border-b">
                    <span className="text-muted-foreground">Nombre / Razón Social</span>
                    <span className="font-medium text-foreground">{result.nombre_receptor || 'Consumidor Final'}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-muted-foreground">RUC Receptor</span>
                    <span className="font-mono text-foreground font-medium">{result.ruc_receptor || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Liquidación de Impuestos (IVA 10%, IVA 5%, Exentas) */}
              <div className="rounded-xl border bg-card p-4 space-y-2">
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Receipt className="size-3.5 text-primary" /> Liquidación e Impuestos
                </span>
                <div className="space-y-1 pt-1 divide-y text-xs">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Operaciones Exentas</span>
                    <span className="font-mono font-medium">{formatGuarani(result.exentas)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">IVA 5%</span>
                    <span className="font-mono">{formatGuarani(result.iva_5)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">IVA 10%</span>
                    <span className="font-mono">{formatGuarani(result.iva_10)}</span>
                  </div>
                  <div className="flex justify-between py-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Total IVA</span>
                    <span className="font-mono">{formatGuarani(result.total_iva ?? result.iva)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold text-sm text-foreground">
                    <span>Total Factura</span>
                    <span className="text-primary font-mono text-base">
                      {formatGuarani(result.total_factura ?? result.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Ítems adicionales si los hubiera */}
            {Array.isArray(result.items) && result.items.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                  <Receipt className="size-4 text-muted-foreground" />
                  Ítems detectados ({result.items.length})
                </h3>
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/60 text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5 text-left font-medium">Descripción</th>
                        <th className="p-2.5 text-center font-medium w-16">Cant.</th>
                        <th className="p-2.5 text-right font-medium w-24">Unitario</th>
                        <th className="p-2.5 text-right font-medium w-24">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {result.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="p-2.5 font-medium">{it.descripcion}</td>
                          <td className="p-2.5 text-center text-muted-foreground">{it.cantidad ?? 1}</td>
                          <td className="p-2.5 text-right text-muted-foreground">
                            {it.precioUnitario ? formatGuarani(it.precioUnitario) : '-'}
                          </td>
                          <td className="p-2.5 text-right font-semibold">
                            {it.total ? formatGuarani(it.total) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Visor de JSON limpio (sin id ni tracking_id) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowRawJson(!showRawJson)}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  {showRawJson ? 'Ocultar JSON de respuesta' : 'Ver datos completos en formato JSON'}
                </Button>
                {showRawJson && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => copyCleanJson(result)}
                    className="gap-1 text-xs"
                  >
                    {copiedRaw ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    {copiedRaw ? 'Copiado al portapapeles' : 'Copiar datos'}
                  </Button>
                )}
              </div>

              {showRawJson && (
                <pre className="max-h-72 overflow-auto rounded-xl border bg-muted/40 p-4 font-mono text-xs leading-relaxed text-foreground">
                  {getCleanJsonString(result)}
                </pre>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Zona de carga y selección de imágenes */
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="size-4 text-muted-foreground" />
                  Imágenes de la Factura
                </CardTitle>
                <CardDescription>
                  Puedes añadir varias imágenes de la misma factura (página 1, página 2, etc.)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Inputs ocultos para Galería y Cámara */}
                <input
                  ref={galleryInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {/* Dropzone interactiva */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/80 bg-muted/10 p-8 text-center transition-colors hover:border-primary/50 hover:bg-muted/20"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3 shadow-xs">
                    <Upload className="size-7" />
                  </div>

                  <p className="font-heading text-base font-semibold text-foreground">
                    Arrastra tus fotos aquí
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                    Soporta JPG, PNG, WEBP, HEIC de hasta 15MB por archivo.
                  </p>

                  {/* Botones de acción para móvil y desktop */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
                    <Button
                      type="button"
                      variant="default"
                      size="sm"
                      onClick={() => galleryInputRef.current?.click()}
                      disabled={isProcessing}
                      className="gap-1.5"
                    >
                      <Upload className="size-3.5" />
                      Seleccionar Archivos
                    </Button>

                    {/* El botón de tomar foto solo se renderiza si se detecta un dispositivo móvil */}
                    {isMobileDevice && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={openCamera}
                        disabled={isProcessing}
                        className="gap-1.5"
                      >
                        <Camera className="size-3.5" />
                        Tomar Foto (Cámara)
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progreso de subida */}
                {isProcessing && (
                  <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="flex items-center gap-2">
                        <Loader2 className="size-3.5 animate-spin text-primary" />
                        Subiendo y procesando comprobante…
                      </span>
                      <span className="tabular-nums font-mono text-muted-foreground">
                        {uploadProgress}%
                      </span>
                    </div>
                    <Progress value={uploadProgress || 65} className="h-2" />
                    <p className="text-[11px] text-muted-foreground">
                      Analizando la estructura del comprobante y extrayendo montos, fechas e ítems.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Listado de miniaturas añadidas */}
            {images.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Fotos seleccionadas ({images.length})
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={clearAll}
                    disabled={isProcessing}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3 mr-1" />
                    Limpiar todas
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <InvoiceThumbnailCard
                      key={img.id}
                      img={img}
                      index={index}
                      isProcessing={isProcessing}
                      onRemove={removeImage}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel Lateral: Acción y Resumen */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Resumen de Carga</CardTitle>
                <CardDescription>
                  {images.length === 0
                    ? 'Añade fotos para comenzar'
                    : `${images.length} imagen(es) listas para procesar`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Imágenes totales</span>
                    <span className="font-semibold tabular-nums">{images.length}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-muted-foreground">Tamaño estimado</span>
                    <span className="font-semibold tabular-nums">
                      {(images.reduce((acc, it) => acc + it.size, 0) / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Modo</span>
                    <span className="text-[11px] font-medium text-foreground">
                      Extracción Instantánea
                    </span>
                  </div>
                </div>

                <Separator />

                <Button
                  type="button"
                  size="lg"
                  className="w-full gap-2 font-medium"
                  disabled={images.length === 0 || isProcessing}
                  onClick={processInvoice}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Procesando Factura…
                    </>
                  ) : (
                    'Procesar Factura'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Consejos para captura óptima */}
            <Card className="bg-muted/30">
              <CardContent className="pt-4 text-xs space-y-2 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-primary" /> Consejos para mejor Procesamiento
                </p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Evita sombras y reflejos directos.</li>
                  <li>Asegúrate de que los importes y fechas sean legibles.</li>
                  <li>Si la factura tiene varias páginas, súbelas todas juntas.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Diálogo con Visor de Cámara en vivo y gestión de permisos */}
      <CameraCaptureDialog
        open={isCameraOpen}
        onOpenChange={setIsCameraOpen}
        onCapture={handleCameraCapture}
      />
    </div>
  )
}
