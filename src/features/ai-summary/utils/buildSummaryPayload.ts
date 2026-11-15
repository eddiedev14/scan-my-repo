import { Report } from '@/shared/types'

//* Convierte un Report en e body que espera POST /api/summarize (español)
export function buildSummaryPayload(report: Report) {
  const weeks = report.commitsPerWeek

  return {
    repo: report.repo,
    descripcion: report.description,
    estrellas: report.stars,
    forks: report.forks,
    licencia: report.license ?? 'Sin licencia',
    creado: report.createdAt,
    ultimoPush: weeks.at(-1)?.week ?? report.createdAt,
    lenguajes: Object.fromEntries(report.languages.map((l) => [l.name, l.percent])),
    contribuidores: report.contributors.length,
    commitsRecientes: weeks.reduce((total, w) => total + w.commits, 0),
    issuesAbiertos: report.issues.open,
    issuesCerrados: report.issues.closed,
    repoVacio: report.isEmptyRepo,
    readme: (report.readme ?? '').slice(0, 4000),
  }
}
