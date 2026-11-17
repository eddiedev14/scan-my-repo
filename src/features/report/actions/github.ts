import { githubApi, isAppError } from '@/features/report/api/github'
import {
  countIssues,
  decodeReadme,
  groupCommitsByWeek,
  mapContributors,
  mapLicense,
  toDateOnly,
  toLanguagePercentages,
} from '@/features/report/utils/transformers'
import type { GithubCommit, GithubContributor, GithubIssue, GithubRepo } from '@/features/report/utils/transformers'
import type { AppError, Report } from '@/shared/types'

const MESSAGES: Record<AppError['type'], string> = {
  NOT_FOUND: 'No encontramos ese repositorio. Verifica que exista y que sea público.',
  RATE_LIMIT:
    'Alcanzaste el límite de consultas de GitHub (60 por hora). Intenta más tarde o abre un análisis de tu historial.',
  NETWORK: 'No pudimos conectar con GitHub. Revisa tu conexión.',
  SERVER: 'No pudimos consultar GitHub. Intenta de nuevo.',
  UNKNOWN: 'No pudimos consultar GitHub. Intenta de nuevo.',
}

/** Personaliza el mensaje de un AppError con los textos de este flujo. */
export function toGithubError(error: unknown): AppError {
  if (!isAppError(error)) return { type: 'UNKNOWN', message: MESSAGES.UNKNOWN }
  return { ...error, message: MESSAGES[error.type] ?? MESSAGES.UNKNOWN }
}

const path = (owner: string, repo: string) => `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`

// Un servicio por endpoint
export const getRepo = (owner: string, repo: string) =>
  githubApi.get<GithubRepo>(path(owner, repo)).then((res) => res.data)

export const getLanguages = (owner: string, repo: string) =>
  githubApi.get<Record<string, number>>(`${path(owner, repo)}/languages`).then((res) => res.data)

export const getContributors = (owner: string, repo: string) =>
  githubApi
    .get<GithubContributor[] | ''>(`${path(owner, repo)}/contributors`, { params: { per_page: 10 } })
    // 204 (sin contribuidores) llega sin cuerpo
    .then((res) => (Array.isArray(res.data) ? res.data : []))

export const getCommits = (owner: string, repo: string) =>
  githubApi.get<GithubCommit[]>(`${path(owner, repo)}/commits`, { params: { per_page: 100 } }).then((res) => res.data)

export const getReadme = (owner: string, repo: string) =>
  githubApi.get<{ content: string }>(`${path(owner, repo)}/readme`).then((res) => res.data)

export const getIssues = (owner: string, repo: string) =>
  githubApi
    .get<GithubIssue[]>(`${path(owner, repo)}/issues`, { params: { state: 'all', per_page: 100 } })
    .then((res) => res.data)

/** Arma el Report completo con 6 peticiones. Rechaza siempre con un AppError. */
export async function getReport(owner: string, repo: string): Promise<Report> {
  let info: GithubRepo
  try {
    info = await getRepo(owner, repo)
  } catch (error) {
    throw toGithubError(error)
  }

  // allSettled: si una consulta secundaria falla no se pierde todo el reporte
  const [languages, contributors, commits, readme, issues] = await Promise.allSettled([
    getLanguages(owner, repo),
    getContributors(owner, repo),
    getCommits(owner, repo),
    getReadme(owner, repo),
    getIssues(owner, repo),
  ])

  // El límite de GitHub sí corta todo, venga de la consulta que venga
  for (const result of [languages, contributors, commits, readme, issues]) {
    if (result.status === 'rejected' && isAppError(result.reason) && result.reason.type === 'RATE_LIMIT') {
      throw toGithubError(result.reason)
    }
  }

  // 409 = repositorio vacío
  const emptyByStatus = commits.status === 'rejected' && isAppError(commits.reason) && commits.reason.status === 409
  const commitList = commits.status === 'fulfilled' ? commits.value : []

  return {
    repo: info.full_name, // el nombre real, no lo que escribió el usuario (puede haber cambiado de dueño o nombre)
    owner: info.owner.login,
    name: info.name,
    url: info.html_url,
    description: info.description,
    stars: info.stargazers_count,
    forks: info.forks_count,
    license: mapLicense(info.license),
    createdAt: toDateOnly(info.created_at),
    languages: languages.status === 'fulfilled' ? toLanguagePercentages(languages.value) : [],
    contributors: contributors.status === 'fulfilled' ? mapContributors(contributors.value) : [],
    commitsPerWeek: groupCommitsByWeek(commitList),
    issues: issues.status === 'fulfilled' ? countIssues(issues.value) : { open: 0, closed: 0 },
    readme: readme.status === 'fulfilled' ? decodeReadme(readme.value.content) : null,
    isEmptyRepo: emptyByStatus || (commits.status === 'fulfilled' && commitList.length === 0),
  }
}
