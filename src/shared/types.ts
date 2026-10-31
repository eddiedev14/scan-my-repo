// Contratos de docs/CONTRATOS.md. Fechas como string ISO ("AAAA-MM-DD") para que sean serializables.

export interface Language { name: string; percent: number }
export interface Contributor { user: string; avatar: string; commits: number }
export interface WeeklyCommits { week: string; commits: number }

export interface Report {
  repo: string
  owner: string
  name: string
  url: string
  description: string | null
  stars: number
  forks: number
  license: string | null
  createdAt: string
  languages: Language[]
  contributors: Contributor[]
  commitsPerWeek: WeeklyCommits[]
  issues: { open: number; closed: number }
  readme: string | null
  isEmptyRepo: boolean
}

export interface AiResult {
  summary: string
  score: number
  strengths: string[]
  improvements: string[]
}

export interface HistoryEntry {
  id: string
  repo: string
  date: string
  data: Report
  ia: AiResult | null
}

export interface AppError {
  type: 'NETWORK' | 'NOT_FOUND' | 'RATE_LIMIT' | 'SERVER' | 'UNKNOWN'
  message: string
  status?: number
  headers?: object
}
