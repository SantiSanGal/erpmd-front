import { useState } from 'react'
import { FileText, Trash2, Smartphone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { PreviewImage } from '@/hooks/single-invoice/useSingleInvoice'

interface InvoiceThumbnailCardProps {
  img: PreviewImage
  index: number
  isProcessing: boolean
  onRemove: (id: string) => void
}

export function InvoiceThumbnailCard({
  img,
  index,
  isProcessing,
  onRemove,
}: InvoiceThumbnailCardProps) {
  const isHeic = /\.(heic|heif)$/i.test(img.file.name) || img.file.type.toLowerCase().includes('heic')
  const [hasError, setHasError] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Si falló al cargar o es HEIC y aún no carga nativamente
  const showFallback = hasError || (isHeic && !isLoaded)

  return (
    <div className="group relative aspect-3/4 overflow-hidden rounded-xl border bg-muted/40 shadow-xs flex flex-col justify-between">
      {/* Intento de renderizado de imagen real */}
      {!hasError && (
        <img
          src={img.url}
          alt=""
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Vista previa estilizada cuando es HEIC (iPhone) o falla el codec de navegador */}
      {showFallback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-b from-indigo-950/20 via-background to-muted/80">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2 shadow-xs border border-primary/20">
            {isHeic ? <Smartphone className="size-6" /> : <FileText className="size-6" />}
          </div>
          <span className="font-semibold text-xs text-foreground line-clamp-1 break-all">
            {img.file.name}
          </span>
          <Badge
            variant="outline"
            className="mt-1 text-[10px] px-1.5 py-0 border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-mono"
          >
            {isHeic ? 'Foto iPhone (HEIC)' : 'Comprobante listo'}
          </Badge>
          <span className="text-[10px] text-muted-foreground mt-1">
            Listo para OCR con IA
          </span>
        </div>
      )}

      {/* Degradado inferior para legibilidad del nombre */}
      {isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      )}

      {/* Badge de número de página arriba a la izquierda */}
      <Badge
        variant="secondary"
        className="relative z-10 m-2 self-start text-[10px] bg-background/80 backdrop-blur-xs font-mono shadow-xs border"
      >
        Pág. {index + 1}
      </Badge>

      {/* Botón para remover arriba a la derecha */}
      <Button
        type="button"
        variant="destructive"
        size="icon-xs"
        onClick={() => onRemove(img.id)}
        disabled={isProcessing}
        className="absolute top-2 right-2 z-10 opacity-90 hover:opacity-100 shadow-sm"
        aria-label="Quitar foto"
      >
        <Trash2 className="size-3" />
      </Button>

      {/* Información de archivo en el pie */}
      <div className="relative z-10 p-2 text-[10px] text-white/90 truncate font-mono">
        <p className="truncate drop-shadow-xs font-medium">{img.file.name}</p>
        <p className="text-white/70 text-[9px]">
          {(img.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  )
}
