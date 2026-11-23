import { useState, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import type { NavigationTab } from '@/types'

export function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false)

  const activeTab = useMemo<NavigationTab>(() => {
    if (location.pathname.startsWith('/batch')) return 'batch'
    if (location.pathname.startsWith('/reportes')) return 'reports'
    return 'single'
  }, [location.pathname])

  const handleSelectTab = (tab: NavigationTab) => {
    switch (tab) {
      case 'batch':
        navigate('/batch')
        break
      case 'reports':
        navigate('/reportes')
        break
      case 'single':
      default:
        navigate('/')
        break
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground antialiased selection:bg-primary/15 selection:text-foreground">
      {/* Header compartido con Facturitas, DarkMode Toggle, PWA Install y Avatar con Dropdown */}
      <Header onToggleSidebar={() => setIsSidebarOpenMobile((prev) => !prev)} />

      <div className="flex flex-1">
        {/* Sidebar compartido */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Contenido principal de la página protegida */}
        <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Navegación inferior móvil nativa para PWA / Smartphone */}
      <BottomNav activeTab={activeTab} onSelectTab={handleSelectTab} />
    </div>
  )
}
