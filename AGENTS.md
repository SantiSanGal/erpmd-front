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

## 4. Calidad y Verificación

- Antes de dar por finalizada cualquier tarea, verificar:
  - `npm run lint` sin errores ni advertencias.
  - `npm run build` sin errores de compilación TypeScript.
