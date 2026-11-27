import { Share, PlusSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface IosInstallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IosInstallDialog({ open, onOpenChange }: IosInstallDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-border/40 p-1 overflow-hidden shrink-0">
              <img src="/logo.png" alt="Facturitas Logo" className="size-full object-contain" />
            </div>
            <div>
              <DialogTitle>Instalar Facturitas en iOS</DialogTitle>
              <DialogDescription>
                Accede rápidamente desde la pantalla de inicio de tu iPhone o iPad
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-sm">
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-foreground font-semibold shadow-xs">
              1
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Abre Safari y pulsa Compartir</p>
              <p className="text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5 flex-wrap">
                Toca el botón <Share className="inline size-4 text-primary" /> en la barra inferior de Safari.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-foreground font-semibold shadow-xs">
              2
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Selecciona "Añadir a pantalla de inicio"</p>
              <p className="text-xs text-muted-foreground leading-relaxed flex items-center gap-1.5 flex-wrap">
                Desplaza hacia abajo y selecciona <PlusSquare className="inline size-4 text-primary" />{' '}
                <span className="font-semibold text-foreground">Añadir a pantalla de inicio</span>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-background text-foreground font-semibold shadow-xs">
              3
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">Confirma pulsando "Añadir"</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                ¡Listo! Podrás usar <span className="font-semibold text-foreground">Facturitas</span> en pantalla completa con rendimiento nativo.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={() => onOpenChange(false)}>
            Entendido
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
