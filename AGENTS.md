# Reglas de Desarrollo y Estándares para Agentes (Facturitas)

Este documento define las directrices y estándares obligatorios para cualquier agente de IA o desarrollador que trabaje en el frontend de **Facturitas**.

## 1. Componentes de UI: Uso Exclusivo de shadcn/ui

- **Obligatorio:** Todas las interfaces de usuario deben construirse utilizando los componentes de **shadcn/ui** ubicados en `src/components/ui/` (`Button`, `Card`, `Input`, `Label`, `Avatar`, `DropdownMenu`, `Select`, `Dialog`, `Alert`, `Table`, `Badge`, `Separator`, etc.).
- **Prohibición:** No usar etiquetas HTML desnudas o sin estilos (como `<button>`, `<input>`, `<select>` nativos sin estilizar) cuando exista un equivalente en shadcn/ui o cuando deba agregarse uno nuevo desde Radix UI / shadcn.
- **Estilos:** Mantener la coherencia estética con Tailwind CSS v4, soporte completo para modo claro/oscuro con variables CSS (`--background`, `--foreground`, `--primary`, etc.), bordes redondeados consistentes (`rounded-xl` / `rounded-lg`) y feedback visual (estados hover, focus, active, disabled).

## 2. Peticiones HTTP y Estado del Backend: TanStack Query Obligatorio

- **Obligatorio:** Todas las llamadas al backend deben realizarse a través de **TanStack Query** (`@tanstack/react-query` v5).
  - Peticiones de lectura (`GET`): Implementar mediante `useQuery`.
  - Peticiones de escritura (`POST`, `PUT`, `DELETE`): Implementar mediante `useMutation`.
- **Prohibición:** Nunca invocar Axios o `fetch` directamente dentro de componentes de React ni dentro de un `useEffect`.
- **Arquitectura en Capas:**
  - `src/api/<modulo>/<modulo>.api.ts`: Definición de funciones asíncronas puras que utilizan `apiClient` o `authClient`.
  - `src/hooks/<modulo>/use<Accion>.ts`: Hooks de TanStack Query (`useQuery` o `useMutation`) que consumen las funciones API, gestionan estados (`isPending`, `isError`, `data`, `error`) y transformaciones.
  - `src/components/` o `src/pages/`: Consumen únicamente los hooks de TanStack Query.

## 3. Autenticación y Cabeceras de Sesión

- Las peticiones HTTP deben realizarse siempre a través de los clientes configurados (`apiClient` para facturas/reportes y `authClient` para auth).
- Los interceptores en `src/api/client.ts` inyectan automáticamente el encabezado `Authorization: Bearer <token>` leyendo el token de `localStorage`.
- Las rutas protegidas verifican el estado booleano de sesión (`isAuthenticated` provisto por `useAuth()`) mediante el componente `ProtectedRoute`.

## 4. Prohibición Absoluta de Mocks y Valores Hardcodeados

- **Cero Mocks o Simulaciones:**
  - Queda estrictamente prohibido implementar datos falsos (*mock data*, *dummy data*, *fixtures*), subidas simuladas, respuestas ficticias o demoras artificiales (`setTimeout`) en servicios, hooks o componentes.
  - Toda consulta y mutación debe operar contra la API real del backend mediante TanStack Query.
- **Cero URLs, IPs o Puertos en Duro:**
  - Ninguna dirección IP (`127.0.0.1`), host local (`localhost`), puerto (`8080`, etc.), protocolo o dominio (`sanigama.com`, etc.) debe estar escrito directamente en el código fuente.
  - Todos los clientes HTTP deben consumir la URL base centralizada provista por `src/config/env.ts`, la cual se alimenta exclusivamente de la variable de entorno única `VITE_API_URL` según el entorno (`.env.development` para desarrollo y `.env.production` para producción).
- **Cero Datos Sensibles o Identificadores Personales:**
  - Los campos de texto, placeholders y estados iniciales deben usar formatos genéricos (ej. `usuario@ejemplo.com`). No incluir correos, nombres o credenciales reales quemadas en el código.

## 5. Paleta de Colores Oficial (Gama Morado / Violeta / Índigo)

- **Identidad Cromática:**
  - La paleta oficial de acentos e interacción principal de **Facturitas** se basa en la gama de **morado / violeta / índigo**.
- **Modo Claro (Light Mode):**
  - **Acento y Botones Destacados:** Violeta profundo / Púrpura (`#7c3aed` / `purple-600` / `violet-600`).
  - **Degradados de Acción:** `from-purple-600 via-violet-600 to-indigo-600` con texto blanco.
  - **Sombras de Acento:** `shadow-purple-600/35`.
  - **Fondos:** `#ffffff` para tarjetas y fondo general neutro.
- **Modo Oscuro (Dark Mode):**
  - **Acento y Botones Destacados:** Violeta luminoso / Púrpura brillante (`#a855f7` / `#8b5cf6` / `purple-500` / `violet-400`).
  - **Degradados de Acción:** `dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500` con texto blanco.
  - **Sombras de Acento:** `dark:shadow-purple-500/25`.
  - **Fondos:** Carbón profundo `#09090b` (`--background`) con tarjetas en `oklch(0.205 0 0)`.
- **Prohibición de Colores Desalineados:**
  - No usar colores desalineados con la identidad (como verdes lima estridentes) para botones centrales de acción o elementos protagónicos.

## 6. Calidad y Verificación

- Antes de dar por finalizada cualquier tarea, verificar:
  - `npm run lint` sin errores ni advertencias.
  - `npm run build` sin errores de compilación TypeScript.
