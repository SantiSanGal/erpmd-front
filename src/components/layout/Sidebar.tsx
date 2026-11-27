import { FileText, Layers, BarChart3, X, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { NavigationTab } from '@/types'

interface SidebarProps {
  activeTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
  isOpenMobile: boolean
  onCloseMobile: () => void
}

interface NavItem {
  id: NavigationTab
  label: string
  subtitle: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'single',
    label: 'Cargar Factura',
    subtitle: 'Procesamiento instantáneo de 1 factura',
    icon: FileText,
  },
  {
    id: 'batch',
    label: 'Cargar Lote de Facturas',
    subtitle: 'Procesamiento masivo en segundo plano',
    icon: Layers,
    badge: 'Batch',
  },
  {
    id: 'reports',
    label: 'Reportes',
    subtitle: 'Consulta mensual y exportación Excel/CSV',
    icon: BarChart3,
  },
]

export function Sidebar({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}: SidebarProps) {
  const handleNavClick = (tab: NavigationTab) => {
    onSelectTab(tab)
    onCloseMobile()
  }

  const content = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Cabecera del Sidebar para vista móvil */}
        <div className="flex items-center justify-between md:hidden pb-2 border-b">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-white shadow-xs ring-1 ring-border/40 p-0.5 overflow-hidden shrink-0">
              <img src="/logo.png" alt="Facturitas Logo" className="size-full object-contain" />
            </div>
            <span className="font-heading font-bold text-foreground">Facturitas</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onCloseMobile}
            aria-label="Cerrar navegación"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Sección de Menú */}
        <div className="space-y-1.5">
          <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            Navegación
          </p>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    'group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all outline-none',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm font-medium'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                        isActive
                          ? 'bg-primary-foreground/15 text-primary-foreground'
                          : 'bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground'
                      )}
                    >
                      <Icon className="size-4.5" />
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-medium leading-none">{item.label}</p>
                      <p
                        className={cn(
                          'text-[11px] truncate mt-1',
                          isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                        )}
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {item.badge && !isActive && (
                      <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                        {item.badge}
                      </Badge>
                    )}
                    <ChevronRight
                      className={cn(
                        'size-4 opacity-50 transition-transform group-hover:translate-x-0.5',
                        isActive && 'opacity-100'
                      )}
                    />
                  </div>
                </button>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Sidebar fijo para pantallas de escritorio (Desktop / Tablet horizontal) */}
      <aside className="hidden md:block w-72 shrink-0 border-r bg-sidebar/50 backdrop-blur-xs min-h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Drawer Off-canvas para pantallas móviles */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop con blur */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Panel deslizante */}
          <div className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-xs bg-sidebar shadow-2xl transition-transform animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  )
}
