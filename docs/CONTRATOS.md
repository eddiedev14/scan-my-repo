# Contratos

Fuente de verdad de los datos. Los tipos TypeScript viven en `src/shared/types.ts`.
Campos en inglés, tal cual. Las fechas son strings ISO (`"AAAA-MM-DD"`) para poder guardarlas en localStorage.

## Report
Lo que devolverá `getReport` y lo que reciben los componentes.

```
repo: string               "eddiedev14/linknest" (full_name de GitHub)
owner: string
name: string               "linknest"
url: string                "https://github.com/eddiedev14/linknest"
description: string|null
stars: number
forks: number
license: string|null       spdx_id, p. ej. "MIT"; null si no tiene
createdAt: date
languages: [{ name: string, percent: number }]            ordenado de mayor a menor, 1 decimal; [] si no hay
contributors: [{ user: string, avatar: string, commits: number }]   máximo 10, orden de GitHub
commitsPerWeek: [{ week: "AAAA-MM-DD" (lunes), commits: number }]   ascendente, con semanas en 0 incluidas; [] si no hay
issues: { open: number, closed: number }                  sin pull requests, máximo 10 analizados
readme: string|null        texto completo ya decodificado; null si no existe
isEmptyRepo: boolean       true si el repositorio no tiene commits
```

## AiResult
```
summary: string
score: number              1.0 a 5.0, un decimal
strengths: string[]        2 a 5
improvements: string[]     2 a 5
```

## HistoryEntry
```
id: string                 crypto.randomUUID()
repo: string
date: date
data: Report
ia: AiResult|null
```

## AppError
Lo que rechazan todos los servicios y hooks.
```
type: "NETWORK" | "NOT_FOUND" | "RATE_LIMIT" | "SERVER" | "UNKNOWN"
message: string            en español, listo para mostrar
status?: number
headers?: object
```

## Correcciones al enunciado original
Typos evidentes que se corrigieron para que los tres equipos usen los mismos nombres:
`nme` → `name`, `licence` → `license`, `users` → `user` (contribuyentes). El tipo se llama `Report`
(el enunciado también lo menciona como `RepoReport`).

## Firmas de hooks y props (base actual)
| Pieza | Firma |
|-------|-------|
| `useRepoReport(repo)` | `{ data: Report \| null, loading: boolean, error: AppError \| null }` |
| `useAiSummary(report)` | `{ data: AiResult \| null, loading, error }` (no exportado por el barrel) |
| `useHistory()` | `{ entries, add(data, ia), remove(id), clear() }` (no exportado por el barrel) |
| `useExportReport()` | `{ ref, exporting, exportPng() }` |
| `useReadmeExport()` | `{ exportReadme(report, ia) }` |
| `SearchBar` | `{ onSearch(repo: "usuario/repo") }` |
| `StatsCards` | `{ report }` |
| `LanguagesChart` | `{ languages }` |
| `CommitsChart` | `{ data: commitsPerWeek }` |
| `ContributorsList` | `{ contributors }` |
| `IssuesCard` | `{ issues }` |
| `AiSummary` | `{ result: AiResult }` |
| `ScoreMeter` | `{ score }` |
| `HistoryPanel` | `{ entries: HistoryEntry[], onSelect(entry) }` |
