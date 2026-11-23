import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/auth/useAuth'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

/**
 * Componente de ruta protegida.
 * Verifica un booleano local (isAuthenticated en el contexto del usuario)
 * sin llamadas innecesarias al backend. Si no está autenticado, redirige a /login.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ? <>{children}</> : <Outlet />
}
