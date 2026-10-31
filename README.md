# Scan my Repo

Pega `usuario/repo` o la URL de un repositorio público de GitHub y obtén un reporte visual (lenguajes, commits por semana, contribuidores, issues) con un resumen hecho por IA y una calificación de 1 a 5.

> **Estado:** base del proyecto. Todo muestra datos de ejemplo (`src/shared/mocks`); aún no hay llamadas reales a GitHub ni a la IA, gráficas reales, historial persistente ni exportación.

## Stack
React + Vite + TypeScript · Tailwind CSS v4 (`@tailwindcss/vite`) · React Router DOM · axios · recharts · html-to-image

## Instalación
1. Instala Node.js 20 o superior.
2. `npm install`
3. Copia las variables: `cp .env.example .env` y completa `GROQ_API_KEY` (y `GROQ_MODEL` si cambia).
4. `npm run dev` y abre http://localhost:5173
5. `npm run build` genera la versión de producción en `dist/`.

## Estructura
```
src/
  pages/        HomePage, ReportPage (solo importan del index.ts de cada feature)
  features/     search · report · ai-summary · history · export
                cada una con components/, hooks/, (api/, actions/, utils/) e index.ts
  shared/       components, hooks, mocks y types.ts (no importa de features ni pages)
  styles/       index.css con los tokens de Tailwind
docs/           CONTRATOS.md (datos y firmas), DISENO.md y DESIGN.md (diseño)
```
Reglas: una feature nunca importa de otra; todo componente recibe sus datos por props.

## Probar los mocks
- `/report/eddiedev14/sigeu`: reporte normal
- `/report/demo/muchos-lenguajes`: 9 lenguajes (los 7 primeros + «Otros»)
- `/report/demo/repo-vacio`: repositorio sin commits

## Autores
Eddie Santiago Delgado Campo · Christian David Home Acero · Manuel Betancurt Pérez

## Licencia
Sin licencia definida todavía. Proyecto académico (Proyecto Informático, UAO, 2026).
