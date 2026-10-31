# Scan my Repo

Web donde se pega `usuario/repo` o la URL de un repositorio público de GitHub y se muestra un reporte visual (lenguajes, commits por semana, contribuidores, issues) con un resumen hecho por IA y una calificación de 1 a 5. Proyecto Informático · UAO · 2026.

**Estado:** solo la base. Todo muestra datos de `src/shared/mocks`. Aún no hay llamadas reales a GitHub ni a Groq, gráficas con recharts, historial persistente ni exportación. Cada pieza pendiente está marcada con `TODO` en su archivo stub.

## Comandos
- `npm run dev`: servidor de desarrollo (http://localhost:5173)
- `npm run build`: `tsc --noEmit` + `vite build` (debe pasar sin errores)
- `npx prettier --write src`: formato (config en `.prettierrc`: sin `;`, comillas simples, ancho 120)

## Stack
React 19 + Vite + TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`, tokens en `@theme`) · React Router DOM · axios · recharts · html-to-image · prettier. No agregar otras dependencias sin acordarlo.

## Estructura
```
src/
  pages/      HomePage, ReportPage
  features/   search · report · ai-summary · history · export
              (components/, hooks/, y según el caso api/, actions/, utils/, más index.ts)
  shared/     components, hooks, mocks, types.ts
  styles/     index.css (tokens y animaciones)
docs/         CONTRATOS.md (datos y firmas), DESIGN.md (referencia de estilo Notion, tema claro)
```

## Reglas de imports (obligatorias)
- Todo lo que viva en `src` se importa con el alias `@/...`, nunca con rutas relativas (`@/shared/components/Card`, no `../../shared/...`). El alias está en `vite.config.js` (`resolve.alias`) y en `tsconfig.json` (`paths`).
- Una feature nunca importa archivos de otra feature.
- Las pages importan solo desde el `index.ts` de cada feature (barrel).
- `shared` no importa nada de `features` ni de `pages`.
- Todo componente recibe sus datos por props.
- Cada `index.ts` exporta solo lo acordado: search → `SearchBar`; report → `StatsCards`, `LanguagesChart`, `CommitsChart`, `ContributorsList`, `IssuesCard`, `useRepoReport`; ai-summary → `AiSummary`, `ScoreMeter`; history → `HistoryPanel`; export → `useExportReport`, `useReadmeExport`.

## Contratos
La fuente de verdad es `docs/CONTRATOS.md`; los tipos están en `src/shared/types.ts` (`Report`, `AiResult`, `HistoryEntry`, `AppError`). Campos en inglés. Fechas como string ISO `"AAAA-MM-DD"`. Todos los servicios y hooks rechazan con `AppError` (mensaje en español listo para mostrar). Respeta nombres y firmas: otras personas trabajan cada feature por separado.

## Navegación
React Router DOM (`BrowserRouter` en `main.tsx`). Rutas en `App.tsx`: `/` y `/report/:owner/:repo`. Cada cambio de ruta muestra un loader de 2 s (spinner + logo). La carga inicial no lo muestra.

## Diseño
- Modo oscuro, minimalista (inspirado en Notion, ver `docs/DESIGN.md`), mobile-first, contraste AA, foco visible.
- Tokens en `src/styles/index.css` (`bg`, `surface`, `surface-2`, `border`, `text`, `muted`, `accent`, `accent-2`, `warn`, `danger`, `chart-1..8`; el 8 es «Otros»). Usar utilidades de Tailwind (`bg-surface`, `text-muted`) o `var(--color-...)`.
- Fuentes: Space Grotesk (títulos y texto) y JetBrains Mono (datos, números, `usuario/repo`).
- Tarjetas con borde fino, sin sombras ni gradientes. Radios: 12px tarjetas, 8px botones, píldoras solo para chips.
- Animaciones mínimas y sin librerías. Aparición con scroll: `Card` y `Reveal` (`shared/components`) usan `useInView`. Las barras usan `.grow-x`/`.grow-y`. Todo se desactiva con `prefers-reduced-motion`.
- Hover blanco/negro solo en las tarjetas con la clase `card-invert` («Qué obtienes»); el resto de `Card` solo ilumina el borde.
- Lenguajes: colores de GitHub por nombre en `LanguagesChart.tsx`; los desconocidos usan la paleta `chart-*`.
- Textos de interfaz en español, cercanos y directos. Identificadores de código en inglés.

## Convenciones de código
- Comentarios breves en español, solo donde aporten.
- Sin punto y coma, comillas simples.
- Mocks de prueba: `/report/eddiedev14/sigeu` (normal), `/report/demo/muchos-lenguajes` (9 lenguajes), `/report/demo/repo-vacio` (sin commits).

## Cosas a tener en cuenta
- `.env.example`: `GROQ_API_KEY` y `GROQ_MODEL`. `vite.config.js` usa `envPrefix: ['VITE_', 'GROQ_']`, así que la clave queda en el bundle del navegador; resolverlo antes de publicar. El modelo `grok-4.7` conviene verificarlo.
- Los barrels de `ai-summary` y `history` no exportan hooks, así que `ReportPage` usa `mockAiResult` y `HomePage` un historial de ejemplo. Al implementarlos hay que ampliar el barrel o ajustar la regla.
- Exportar a PNG: las cards que aún no se vieron con el scroll tienen `opacity: 0` (`.reveal`). `useExportReport` debe forzarlas visibles antes de capturar.
- No hay framework de tests ni ESLint.
