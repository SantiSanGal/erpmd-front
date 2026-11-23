# Reglas Frontend: shadcn/ui y TanStack Query Obligatorios

## 1. shadcn/ui
- Todos los elementos de interfaz deben utilizar componentes de shadcn/ui (`src/components/ui/`).
- No utilizar etiquetas HTML nativas sin estilizar.

## 2. TanStack Query
- Todas las peticiones HTTP hacia el backend deben gestionarse con TanStack Query (`useQuery` para lecturas GET, `useMutation` para escrituras POST/PUT/DELETE).
- No ejecutar Axios ni fetch directamente dentro de componentes React.
- Mantener la separación: `src/api/<seccion>/` -> `src/hooks/<seccion>/` -> `src/pages/` o `src/components/`.

## 3. Autenticación y Token Bearer
- Inyección automática del header `Authorization: Bearer <token>` mediante el interceptor de Axios en `src/api/client.ts`.
- Rutas protegidas mediante el booleano `isAuthenticated` en el contexto `useAuth()`.
