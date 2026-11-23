import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from '@/pages/LoginPage'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { SingleInvoicePage } from '@/pages/SingleInvoicePage'
import { BatchInvoicePage } from '@/pages/BatchInvoicePage'
import { ReportsPage } from '@/pages/ReportsPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <SingleInvoicePage />,
          },
          {
            path: 'facturas',
            element: <Navigate to="/" replace />,
          },
          {
            path: 'batch',
            element: <BatchInvoicePage />,
          },
          {
            path: 'reportes',
            element: <ReportsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
