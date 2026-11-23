import { LogOut, Mail, AtSign, Calendar, ShieldCheck } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/auth/useAuth'

export function UserNav() {
  const { user, logout, isLoading } = useAuth()

  if (!user) {
    return null
  }

  // Obtener iniciales del usuario (ej. Santiago Galván -> SG)
  const firstInitial = user.firstName?.[0] || ''
  const lastInitial = user.lastName?.[0] || ''
  const fallbackInitials = (firstInitial + lastInitial).toUpperCase() || user.username.slice(0, 2).toUpperCase() || 'U'

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username

  const formattedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('es-PY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-9 rounded-full p-0 ring-offset-background transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          aria-label="Abrir menú de usuario"
        >
          <Avatar className="size-9 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 font-semibold text-primary">
              {fallbackInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-2 shadow-xl" align="end" sideOffset={8}>
        {/* Encabezado con datos del usuario */}
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold leading-none text-foreground">{fullName}</p>
              {user.enabled && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  Activo
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <AtSign className="size-3 shrink-0" />
              <span>{user.username}</span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <div className="px-2 py-1.5 text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3 text-primary" />
              <span>Sesión segura activa</span>
            </div>
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3" />
                <span>Miembro desde {formattedDate}</span>
              </div>
            )}
          </div>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Acción de Logout */}
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2 py-2 font-medium"
          onClick={() => void logout()}
          disabled={isLoading}
        >
          <LogOut className="size-4" />
          <span>{isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
