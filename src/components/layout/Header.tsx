import { Sun, Moon, Download, Menu, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '@/hooks/common/useTheme'
import { usePwaInstall } from '@/hooks/common/usePwaInstall'
import { IosInstallDialog } from '@/components/pwa/IosInstallDialog'
import { UserNav } from './UserNav'

interface HeaderProps {
  onToggleSidebar?: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { resolvedTheme, toggleTheme } = useTheme()
  const { isInstallable, isInstalled, isIosPromptOpen, setIsIosPromptOpen, promptInstall } =
    usePwaInstall()

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur-md pt-[env(safe-area-inset-top,0px)] transition-colors">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            {/* Botón menú móvil */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onToggleSidebar}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="size-5" />
            </Button>

            {/* Logo y Nombre “Facturitas” */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-9 items-center justify-center rounded-xl bg-white shadow-xs ring-1 ring-border/40 p-0.5 overflow-hidden shrink-0">
                <img src="/logo.png" alt="Facturitas Logo" className="size-full object-contain" />
              </div>
              <div>
                <span className="font-heading text-lg font-bold tracking-tight text-foreground block">
                  Facturitas
                </span>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Gestión Inteligente de Comprobantes
                </p>
              </div>
            </div>
          </div>

          {/* Acciones del Header */}
          <div className="flex items-center gap-2">
            {/* Botón de instalación de PWA (si está disponible y no instalada) */}
            {isInstallable && !isInstalled && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={promptInstall}
                className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
              >
                <Download className="size-3.5" />
                <span className="hidden sm:inline">Instalar App</span>
                <span className="sm:hidden">Instalar</span>
              </Button>
            )}

            {isInstalled && (
              <Badge
                variant="outline"
                className="hidden sm:inline-flex gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              >
                <CheckCircle2 className="size-3" />
                PWA Activa
              </Badge>
            )}

            {/* Interruptor modo claro / oscuro */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={`Cambiar a modo ${resolvedTheme === 'dark' ? 'claro' : 'oscuro'}`}
              title={`Modo actual: ${resolvedTheme === 'dark' ? 'Oscuro' : 'Claro'}. Clic para alternar.`}
            >
              {resolvedTheme === 'dark' ? (
                <Sun className="size-4.5 text-amber-400 transition-transform duration-300 rotate-0" />
              ) : (
                <Moon className="size-4.5 text-slate-700 transition-transform duration-300 rotate-0" />
              )}
            </Button>

            {/* Avatar del usuario con Dropdown */}
            <UserNav />
          </div>
        </div>
      </header>

      {/* Modal con instrucciones para iOS PWA */}
      <IosInstallDialog open={isIosPromptOpen} onOpenChange={setIsIosPromptOpen} />
    </>
  )
}
