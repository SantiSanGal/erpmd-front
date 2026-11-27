import { useState } from 'react'
import { FileText, Layers, BarChart3, LogOut, Sun, Moon, ShieldCheck, Mail, AtSign } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { CameraQrIcon } from '@/components/icons/CameraQrIcon'
import { useAuth } from '@/hooks/auth/useAuth'
import { useTheme } from '@/hooks/common/useTheme'
import type { NavigationTab } from '@/types'

interface BottomNavProps {
  activeTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const { user, logout, isLoading: isAuthLoading } = useAuth()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleCenterAction = () => {
    // Si no está en 'single', navega allí primero
    if (activeTab !== 'single') {
      onSelectTab('single')
    }
    // Dispara el evento para que SingleInvoicePage abra el visor de cámara
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('facturitas:open-camera'))
    }, 50)
  }

  const firstInitial = user?.firstName?.[0] || ''
  const lastInitial = user?.lastName?.[0] || ''
  const fallbackInitials = (firstInitial + lastInitial).toUpperCase() || user?.username.slice(0, 2).toUpperCase() || 'U'
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.username || 'Usuario'

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur-md md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_25px_rgba(0,0,0,0.08)]"
        aria-label="Navegación inferior móvil"
      >
        <div className="relative flex h-16 w-full items-center justify-around px-2">
          {/* Tab 1: Cargar Factura */}
          <button
            type="button"
            onClick={() => onSelectTab('single')}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors outline-none',
              activeTab === 'single'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full transition-transform',
                activeTab === 'single' && 'bg-primary/10 text-primary scale-110'
              )}
            >
              <FileText className="size-5" />
            </div>
            <span className="text-[11px] leading-none tracking-tight">Facturas</span>
          </button>

          {/* Tab 2: Lote Batch */}
          <button
            type="button"
            onClick={() => onSelectTab('batch')}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors outline-none',
              activeTab === 'batch'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full transition-transform',
                activeTab === 'batch' && 'bg-primary/10 text-primary scale-110'
              )}
            >
              <Layers className="size-5" />
            </div>
            <span className="text-[11px] leading-none tracking-tight">Lotes</span>
          </button>

          {/* Tab Central Elevado: Cámara / QR Prominente */}
          <div className="relative flex flex-1 flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleCenterAction}
              aria-label="Escanear comprobante con cámara o QR"
              title="Escanear comprobante con cámara o QR"
              className={cn(
                'group -translate-y-5 flex size-14 items-center justify-center rounded-full',
                'bg-gradient-to-tr from-lime-500 via-lime-400 to-emerald-400 text-slate-950',
                'border-4 border-background shadow-xl shadow-lime-500/30',
                'ring-2 ring-lime-500/20 active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer'
              )}
            >
              <CameraQrIcon size={26} className="text-slate-950 stroke-[2.2] transition-transform group-hover:scale-110" />
            </button>
            <span className="-mt-3.5 text-[10px] font-semibold tracking-tight text-foreground/80">
              Escanear
            </span>
          </div>

          {/* Tab 4: Reportes */}
          <button
            type="button"
            onClick={() => onSelectTab('reports')}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors outline-none',
              activeTab === 'reports'
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full transition-transform',
                activeTab === 'reports' && 'bg-primary/10 text-primary scale-110'
              )}
            >
              <BarChart3 className="size-5" />
            </div>
            <span className="text-[11px] leading-none tracking-tight">Reportes</span>
          </button>

          {/* Tab 5: Perfil / Sesión */}
          <button
            type="button"
            onClick={() => setIsProfileOpen(true)}
            aria-label="Abrir opciones de perfil y sesión"
            className="flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors outline-none"
          >
            <div className="flex size-8 items-center justify-center rounded-full transition-transform hover:scale-110">
              <Avatar className="size-7 ring-1.5 ring-border">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-[11px] font-semibold text-primary">
                  {fallbackInitials}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-[11px] leading-none tracking-tight">Perfil</span>
          </button>
        </div>
      </nav>

      {/* Diálogo móvil de perfil y cierre de sesión */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md w-[92vw] max-w-sm rounded-2xl p-6">
          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-bold">Mi Cuenta</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Datos de usuario y ajustes de sesión en Facturitas
            </DialogDescription>
          </DialogHeader>

          {user && (
            <div className="space-y-4 pt-2">
              {/* Información principal */}
              <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
                <Avatar className="size-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-base font-bold text-primary">
                    {fallbackInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="font-semibold text-foreground text-sm truncate">{fullName}</p>
                  <p className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                    <AtSign className="size-3 text-muted-foreground" />
                    {user.username}
                  </p>
                  {user.email && (
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="size-3 text-muted-foreground" />
                      {user.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Estado y rol */}
              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-muted-foreground">Estado de cuenta</span>
                {user.enabled ? (
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1 text-[11px]">
                    <ShieldCheck className="size-3" /> Activo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground text-[11px]">Inactivo</Badge>
                )}
              </div>

              {/* Alternar Modo Oscuro / Claro */}
              <div className="flex items-center justify-between rounded-xl border p-3">
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-foreground">Tema visual</p>
                  <p className="text-[11px] text-muted-foreground">
                    Modo {resolvedTheme === 'dark' ? 'Oscuro' : 'Claro'}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="gap-1.5 text-xs"
                >
                  {resolvedTheme === 'dark' ? (
                    <>
                      <Sun className="size-3.5 text-amber-400" />
                      Claro
                    </>
                  ) : (
                    <>
                      <Moon className="size-3.5 text-slate-700" />
                      Oscuro
                    </>
                  )}
                </Button>
              </div>

              <Separator />

              {/* Botón de Cerrar Sesión */}
              <Button
                type="button"
                variant="destructive"
                className="w-full gap-2 font-medium"
                disabled={isAuthLoading}
                onClick={() => {
                  setIsProfileOpen(false)
                  logout()
                }}
              >
                <LogOut className="size-4" />
                Cerrar Sesión
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
