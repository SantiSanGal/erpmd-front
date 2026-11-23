import { FileText, Layers, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { NavigationTab } from '@/types'

interface BottomNavProps {
  activeTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const tabs: Array<{ id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }> = [
    { id: 'single', label: 'Cargar Factura', icon: FileText },
    { id: 'batch', label: 'Lote Batch', icon: Layers },
    { id: 'reports', label: 'Reportes', icon: BarChart3 },
  ]

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t bg-background/95 backdrop-blur-md px-2 md:hidden pb-[env(safe-area-inset-bottom)]"
      aria-label="Navegación inferior móvil"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 py-1 text-xs font-medium transition-colors outline-none',
              isActive
                ? 'text-primary font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full transition-transform',
                isActive && 'bg-primary/10 text-primary scale-110'
              )}
            >
              <Icon className="size-4.5" />
            </div>
            <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
