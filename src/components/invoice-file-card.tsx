import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  RotateCw,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { formatFileSize } from '@/lib/format'
import type { InvoiceItem, InvoiceStatus } from '@/types/invoice'

type InvoiceFileCardProps = {
  item: InvoiceItem
  onRemove: (id: string) => void
  onRetry: (id: string) => void
}

const STATUS_META: Record<
  InvoiceStatus,
  { label: string; icon: typeof Clock3; className: string }
> = {
  pending: {
    label: 'En cola',
    icon: Clock3,
    className: 'bg-background/90 text-muted-foreground backdrop-blur',
  },
  uploading: {
    label: 'Subiendo',
    icon: Loader2,
    className: 'bg-background/90 text-foreground backdrop-blur',
  },
  success: {
    label: 'Completada',
    icon: CheckCircle2,
    className:
      'border-emerald-500/20 bg-emerald-500/15 text-emerald-700 backdrop-blur dark:text-emerald-300',
  },
  error: {
    label: 'Error',
    icon: AlertCircle,
    className:
      'border-destructive/20 bg-destructive/15 text-destructive backdrop-blur',
  },
}

export function InvoiceFileCard({
  item,
  onRemove,
  onRetry,
}: InvoiceFileCardProps) {
  const meta = STATUS_META[item.status]
  const StatusIcon = meta.icon
  const isUploading = item.status === 'uploading'

  return (
    <Card size="sm" className="group gap-0 overflow-hidden py-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.previewUrl}
          alt={`Vista previa de ${item.file.name}`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 bg-gradient-to-b from-black/45 to-transparent p-2">
          <Badge
            variant="outline"
            className={cn('gap-1 border-transparent', meta.className)}
          >
            <StatusIcon
              className={cn('size-3', isUploading && 'animate-spin')}
            />
            {meta.label}
          </Badge>

          <Button
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label={`Eliminar ${item.file.name}`}
            title="Eliminar"
            disabled={isUploading}
            onClick={() => onRemove(item.id)}
            className="bg-background/90 shadow-sm backdrop-blur hover:bg-background"
          >
            <Trash2 />
          </Button>
        </div>
      </div>

      <CardContent className="space-y-2 p-3">
        <p
          className="truncate text-sm font-medium"
          title={item.file.name}
        >
          {item.file.name}
        </p>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(item.file.size)}</span>
          {isUploading && (
            <span className="font-medium text-foreground">{item.progress}%</span>
          )}
          {item.status === 'success' && (
            <span className="font-medium text-emerald-600 dark:text-emerald-400">
              Procesada
            </span>
          )}
        </div>

        {isUploading && (
          <Progress value={item.progress} className="h-1.5" />
        )}

        {item.status === 'error' && (
          <div className="space-y-2 pt-0.5">
            <p className="line-clamp-2 text-xs leading-relaxed text-destructive">
              {item.error}
            </p>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={() => onRetry(item.id)}
            >
              <RotateCw />
              Reintentar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
