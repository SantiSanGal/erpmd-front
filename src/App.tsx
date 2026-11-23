import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/query-client'
import { ThemeProvider } from '@/context/theme-context'
import { AuthProvider } from '@/context/auth-context'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoginPage } from '@/pages/LoginPage'
import { SingleInvoicePage } from '@/pages/SingleInvoicePage'
import { BatchInvoicePage } from '@/pages/BatchInvoicePage'
import { ReportsPage } from '@/pages/ReportsPage'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="facturitas-theme">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Ruta pública de Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Rutas protegidas que verifican si la sesión está activa */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/" element={<SingleInvoicePage />} />
                  <Route path="/facturas" element={<Navigate to="/" replace />} />
                  <Route path="/batch" element={<BatchInvoicePage />} />
                  <Route path="/reportes" element={<ReportsPage />} />
                </Route>
              </Route>

              {/* Redirección ante cualquier ruta no coincidente */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
