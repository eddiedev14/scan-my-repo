import type { Contributor, Language, WeeklyCommits } from '@/shared/types'

// Partes de las respuestas de la API de GitHub que usamos
export interface GithubRepo {
  full_name: string
  name: string
  html_url: string
  description: string | null
  stargazers_count: number
  forks_count: number
  license: { spdx_id: string | null; name: string } | null
  created_at: string
  owner: { login: string }
}
export interface GithubContributor {
  login: string
  avatar_url: string
  contributions: number
}
export interface GithubCommit {
  commit: { author?: { date?: string } | null; committer?: { date?: string } | null }
}
export interface GithubIssue {
  state: string
  pull_request?: unknown
}

const MAX_CONTRIBUTORS = 10
const DAY_MS = 24 * 60 * 60 * 1000

/** bytes por lenguaje → porcentajes con 1 decimal, de mayor a menor. Total 0 → []. */
export function toLanguagePercentages(bytesByLanguage: Record<string, number>): Language[] {
  const entries = Object.entries(bytesByLanguage ?? {})
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (total === 0) return []
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes]) => ({ name, percent: Math.round((bytes / total) * 1000) / 10 }))
}

const toIsoDay = (date: Date) => date.toISOString().slice(0, 10)

// Lunes (UTC) de la semana de una fecha, en milisegundos
function mondayOf(dateString: string): number | null {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return null
  const day = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  day.setUTCDate(day.getUTCDate() - ((day.getUTCDay() + 6) % 7)) // domingo = 0 → retrocede 6 días
  return day.getTime()
}

/** commits → commits por semana (lunes UTC), ascendente y con las semanas en 0 incluidas. */
export function groupCommitsByWeek(commits: GithubCommit[]): WeeklyCommits[] {
  const counts = new Map<number, number>()
  for (const item of commits) {
    const date = item.commit.author?.date ?? item.commit.committer?.date
    const monday = date ? mondayOf(date) : null
    if (monday !== null) counts.set(monday, (counts.get(monday) ?? 0) + 1)
  }
  if (counts.size === 0) return []

  const weeks = [...counts.keys()]
  const first = Math.min(...weeks)
  const last = Math.max(...weeks)
  const result: WeeklyCommits[] = []
  // Se avanza de 7 en 7 días; en UTC no hay cambios de horario que descuadren la suma
  for (let t = first; t <= last; t += 7 * DAY_MS) {
    result.push({ week: toIsoDay(new Date(t)), commits: counts.get(t) ?? 0 })
  }
  return result
}

/** base64 (con saltos de línea) → texto UTF-8, para que tildes y ñ no salgan rotas. */
export function decodeReadme(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder('utf-8').decode(bytes)
}

/** Cuenta issues abiertos y cerrados ignorando los pull requests. */
export function countIssues(issues: GithubIssue[]): { open: number; closed: number } {
  let open = 0
  let closed = 0
  for (const issue of issues) {
    if ('pull_request' in issue) continue
    if (issue.state === 'open') open++
    else if (issue.state === 'closed') closed++
  }
  return { open, closed }
}

export function mapContributors(list: GithubContributor[]): Contributor[] {
  return list.slice(0, MAX_CONTRIBUTORS).map((c) => ({ user: c.login, avatar: c.avatar_url, commits: c.contributions }))
}

/** spdx_id; si es null o "NOASSERTION" usa el name; sin licencia → null. */
export function mapLicense(license: GithubRepo['license']): string | null {
  if (!license) return null
  if (!license.spdx_id || license.spdx_id === 'NOASSERTION') return license.name || null
  return license.spdx_id
}

/** "2026-01-10T12:00:00Z" → "2026-01-10" */
export function toDateOnly(iso: string): string {
  return iso.slice(0, 10)
}
