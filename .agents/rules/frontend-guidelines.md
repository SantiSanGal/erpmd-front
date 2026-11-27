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

## 4. Cero Mocks y Cero Valores Hardcodeados
- **Sin Mocks:** Prohibido utilizar datos falsos (*dummy/mock*), endpoints simulados o respuestas artificiales. Toda acción debe consultar la API real.
- **Sin URLs quemadas:** Prohibido escribir `localhost`, `127.0.0.1`, puertos o dominios en duro. Toda URL debe consumirse desde `src/config/env.ts` a través de la variable única `VITE_API_URL` (`.env.development` y `.env.production`).
- **Sin identificadores personales quemados:** Placeholders y valores iniciales deben ser siempre genéricos (`usuario@ejemplo.com`).

## 5. Paleta de Colores (Morado / Violeta / Índigo)
- **Modo Claro:** Acentos y acciones destacadas en violeta profundo (`#7c3aed` / `purple-600` / `from-purple-600 via-violet-600 to-indigo-600`) con sombras violetas.
- **Modo Oscuro:** Acentos en violeta luminoso (`#a855f7` / `purple-500` / `dark:from-purple-500 dark:via-violet-500 dark:to-indigo-500`) sobre fondo `#09090b`.
- Prohibido el uso de tonos discordantes (como verdes lima) para la interacción o identidad principal.

## 6. Calidad y Verificación
- `npm run lint` con 0 errores y 0 advertencias.
- `npm run build` sin errores TypeScript antes de concluir.
