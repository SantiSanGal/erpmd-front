import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Camera,
  RotateCcw,
  SwitchCamera,
  AlertCircle,
  Sparkles,
  Upload,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

interface CameraCaptureDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCapture: (file: File) => void
}

export function CameraCaptureDialog({
  open,
  onOpenChange,
  onCapture,
}: CameraCaptureDialogProps) {
  const [permissionError, setPermissionError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [isInitializing, setIsInitializing] = useState(false)
  const [capturedFlash, setCapturedFlash] = useState(false)

  const streamRef = useRef<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fallbackInputRef = useRef<HTMLInputElement>(null)

  // Detener el stream de la cámara de forma segura mediante ref
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [])

  // Iniciar la cámara solicitando permisos
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionError(
        'Tu navegador no soporta el acceso directo a la cámara. Puedes utilizar la cámara nativa del sistema.'
      )
      return
    }

    setIsInitializing(true)
    setPermissionError(null)

    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      }

      const newStream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = newStream

      if (videoRef.current) {
        videoRef.current.srcObject = newStream
        await videoRef.current.play()
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionError(
            'Permiso de cámara denegado. Para escanear comprobantes, permite el acceso a la cámara en los ajustes de tu navegador o pulsa en "Cámara del sistema".'
          )
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setPermissionError('No se encontró ninguna cámara conectada en tu dispositivo.')
        } else {
          setPermissionError(`No se pudo iniciar la cámara: ${err.message}`)
        }
      } else {
        setPermissionError('Ocurrió un error inesperado al intentar acceder a la cámara.')
      }
    } finally {
      setIsInitializing(false)
    }
  }, [])

  // Inicializar cámara al abrir el diálogo y limpiar al cerrar
  useEffect(() => {
    let isCancelled = false

    if (open) {
      const timer = setTimeout(() => {
        if (!isCancelled) {
          void startCamera(facingMode)
        }
      }, 0)

      return () => {
        isCancelled = true
        clearTimeout(timer)
        stopStream()
      }
    } else {
      stopStream()
    }
  }, [open, facingMode, startCamera, stopStream])

  // Capturar foto desde el video hacia un canvas
  const handleTakePhoto = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return

    // Efecto visual de flash
    setCapturedFlash(true)
    setTimeout(() => setCapturedFlash(false), 200)

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(
      (blob) => {
        if (!blob) return

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const file = new File([blob], `factura_camara_${timestamp}.jpg`, {
          type: 'image/jpeg',
          lastModified: Date.now(),
        })

        stopStream()
        onOpenChange(false)
        onCapture(file)
      },
      'image/jpeg',
      0.92
    )
  }

  // Alternar entre cámara trasera y delantera
  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment'
    setFacingMode(nextMode)
    void startCamera(nextMode)
  }

  // Manejador del input de archivo de respaldo (cámara nativa del sistema)
  const handleFallbackFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      stopStream()
      onOpenChange(false)
      onCapture(file)
      e.target.value = ''
    }
  }

  return (
    <>
      {/* Input nativo oculto para respaldo */}
      <input
        ref={fallbackInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFallbackFileChange}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg p-0 overflow-hidden border-border/80 bg-black text-white gap-0">
          <DialogHeader className="p-4 bg-background/90 text-foreground border-b flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Camera className="size-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  Escanear Factura
                </DialogTitle>
                <DialogDescription className="text-xs">
                  {facingMode === 'environment' ? 'Cámara trasera (Óptima)' : 'Cámara frontal'}
                </DialogDescription>
              </div>
            </div>

            <Badge variant="outline" className="text-[10px] gap-1 border-primary/30 text-primary">
              <Sparkles className="size-3" />
              PWA Cámara
            </Badge>
          </DialogHeader>

          {/* Área de visor de la cámara */}
          <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
            {/* Elemento de video en tiempo real */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="size-full object-cover"
            />

            {/* Efecto de destello de captura */}
            {capturedFlash && (
              <div className="absolute inset-0 bg-white opacity-80 pointer-events-none transition-opacity duration-150" />
            )}

            {/* Guía visual para encuadrar la factura */}
            {!permissionError && !isInitializing && (
              <div className="pointer-events-none absolute inset-6 sm:inset-10 flex flex-col items-center justify-between border-2 border-dashed border-white/50 rounded-2xl p-4">
                <span className="text-[11px] font-medium tracking-wide bg-black/50 text-white/90 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Alinea la factura dentro del marco
                </span>
                <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                  Evita sombras y reflejos
                </span>
              </div>
            )}

            {/* Indicador de inicialización */}
            {isInitializing && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 gap-2 text-white">
                <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                <p className="text-xs font-medium">Iniciando cámara y solicitando permisos…</p>
              </div>
            )}

            {/* Mensaje si los permisos fueron denegados o falló la cámara */}
            {permissionError && (
              <div className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-background/95 text-foreground text-center gap-4">
                <Alert variant="destructive" className="text-left">
                  <AlertCircle className="size-4" />
                  <AlertTitle>Acceso a la cámara</AlertTitle>
                  <AlertDescription className="text-xs leading-relaxed">
                    {permissionError}
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col gap-2 w-full max-w-xs">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => fallbackInputRef.current?.click()}
                    className="gap-2"
                  >
                    <Upload className="size-4" />
                    Usar cámara del sistema
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void startCamera(facingMode)}
                    className="gap-2"
                  >
                    <RotateCcw className="size-4" />
                    Reintentar permiso
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Barra inferior de controles */}
          <div className="p-4 bg-background/95 border-t flex items-center justify-between gap-4">
            {/* Botón para cambiar cámara frontal/trasera */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={toggleFacingMode}
              disabled={Boolean(permissionError) || isInitializing}
              title="Cambiar cámara"
              className="rounded-full text-foreground"
            >
              <SwitchCamera className="size-4" />
            </Button>

            {/* Botón principal de Disparo (Shutter Button) */}
            <Button
              type="button"
              onClick={handleTakePhoto}
              disabled={Boolean(permissionError) || isInitializing}
              className="size-16 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-0 shadow-xl shadow-indigo-500/30 ring-4 ring-primary/20 active:scale-95 transition-all flex items-center justify-center"
              aria-label="Tomar fotografía"
            >
              <div className="size-12 rounded-full border-2 border-white flex items-center justify-center">
                <div className="size-9 rounded-full bg-white" />
              </div>
            </Button>

            {/* Botón de respaldo para abrir la app de cámara nativa */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fallbackInputRef.current?.click()}
              title="Abrir cámara nativa de Android/iOS"
              className="rounded-full text-foreground"
            >
              <Upload className="size-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
