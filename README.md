# Facturitas · OCR de Facturas (PWA)

Aplicación web progresiva (**PWA**) instalable en **Android** e **iOS**, diseñada con **React 19**, **TypeScript**, **Tailwind CSS v4**, **shadcn/ui** y gestión de estado asíncrono con **TanStack Query (React Query v5)**.

Permite la extracción inteligente de datos de comprobantes y facturas paraguayas mediante OCR con IA (Gemini Vision), tanto para cargas individuales como procesamiento masivo por lotes (Batch), además de consulta y exportación mensual a **Excel (.xlsx)** y **CSV (.csv)**.

---

## 🚀 Características Principales

1. **TanStack Query en todas las peticiones**:
   - `useMutation` para la carga instantánea de facturas con seguimiento de progreso.
   - `useMutation` para la creación de lotes batch y `useQuery` con polling reactivo para el seguimiento en tiempo real.
   - `useQuery` para la consulta mensual de reportes con cache inteligente y `useMutation` para la exportación de archivos.

2. **Vista de Reportes adaptada a comprobantes fiscales**:
   - Muestra las columnas esenciales: **Fecha**, **Nombre Emisor**, **RUC**, **N° Factura**, **Totales IVA (con desglose 10% y 5%)**, **Exentas** y **Total Factura**.
   - Oculta IDs técnicos, tracking IDs y rutas internas de imagen.
   - **Slider / Navegador mensual con bloqueo futuro**: No permite avanzar más allá del mes actual (ej. Noviembre 2026).
   - Modal para seleccionar mes y formato de exportación (**Excel .xlsx** o **CSV .csv**).
   - Modal de detalle fiscal para inspeccionar todos los datos del emisor, receptor, timbrado e importes.

3. **Arquitectura modular por secciones de páginas**:
   - Endpoints API organizados por carpetas en `src/api/`.
   - Custom Hooks con TanStack Query organizados por carpetas en `src/hooks/`.

4. **PWA Instalable (Android & iOS)**:
   - Web App Manifest nativo (`manifest.webmanifest`) con soporte de iconos adaptativos y maskable.
   - Metatags optimizados para Safari en iOS (`apple-mobile-web-app-capable`, `apple-touch-icon`, `viewport-fit=cover`).
   - Service Worker (`sw.js`) con estrategia de cache Stale-While-Revalidate para navegación offline.
   - Diálogo visual de instalación paso a paso en iPhone/iPad y botón nativo `beforeinstallprompt` en Android/Chrome.
   - Barra de navegación inferior móvil (`BottomNav`) para una experiencia de app móvil nativa.

5. **Modo Claro / Oscuro**:
   - Toggle interactivo en el Header.
   - Sincronización automática con preferencias del sistema (`prefers-color-scheme`) y persistencia en `localStorage`.

---

## 📁 Estructura del Proyecto

```
src/
├── api/                                # Endpoints y llamadas a la API por sección
│   ├── client.ts                       # Clientes Axios y manejo de errores
│   ├── index.ts
│   ├── single-invoice/
│   │   └── single-invoice.api.ts       # POST /api/ocr/facturas/instantaneo
│   ├── batch-invoice/
│   │   └── batch-invoice.api.ts        # POST /batch y GET /batch/{id}
│   └── reports/
│       └── reports.api.ts              # GET /facturas?mes y exportar CSV/Excel
├── hooks/                              # Custom Hooks con TanStack Query por sección
│   ├── index.ts
│   ├── single-invoice/
│   │   └── useSingleInvoice.ts         # Hook useMutation para carga individual
│   ├── batch-invoice/
│   │   └── useBatchInvoice.ts          # Hook useMutation + useQuery para lotes y polling
│   ├── reports/
│   │   └── useReports.ts               # Hook useQuery + useMutation con límite de mes actual
│   └── common/
│       ├── useTheme.ts                 # Hook modo claro / oscuro
│       └── usePwaInstall.ts            # Hook instalación PWA
├── components/
│   ├── layout/
│   │   ├── Header.tsx                  # Header "Facturitas", DarkMode, PWA button
│   │   ├── Sidebar.tsx                 # Sidebar: Cargar Factura, Cargar Lote, Reportes
│   │   ├── BottomNav.tsx               # Navegación inferior móvil
│   │   └── AppLayout.tsx               # Layout principal
│   ├── pwa/
│   │   └── IosInstallDialog.tsx        # Guía de instalación en iOS
│   ├── reports/
│   │   ├── ExportModal.tsx             # Modal para exportar mes y formato Excel/CSV
│   │   └── InvoiceDetailModal.tsx      # Modal de detalle de comprobante
│   └── ui/                             # Componentes shadcn/ui
├── pages/
│   ├── SingleInvoicePage.tsx           # Página "Cargar Factura"
│   ├── BatchInvoicePage.tsx            # Página "Cargar Lote de Facturas"
│   └── ReportsPage.tsx                 # Página "Reportes"
├── config/
│   └── env.ts                          # Configuración de URLs de backend
├── context/
│   ├── theme-types.ts
│   └── theme-context.tsx
└── lib/
    ├── query-client.ts                 # Configuración de TanStack QueryClient
    └── utils.ts
```

---

## ⚙️ Configuración (.env)

Crea un archivo `.env` en la raíz del proyecto:

```env
# URL base del API Gateway (OCR, Batch, Reportes y Autenticación en puerto 8080)
VITE_API_URL=http://localhost:8080
```

---

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo Vite
npm run dev

# Compilar para producción (Type check + Vite build)
npm run build

# Validar calidad de código y buenas prácticas
npm run lint

# Previsualizar el build de producción
npm run preview

# Desplegar en Cloudflare (Build + Wrangler Deploy)
npm run deploy

# Probar localmente con el runtime de Cloudflare
npm run deploy:preview
```
# erpmd-front
# erpmd-front
# erpmd-front
