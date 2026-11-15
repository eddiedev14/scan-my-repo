import { Card } from '@/shared/components/Card'
import type { Report } from '@/shared/types'
import { formatDate, formatNumber, timeAgo } from '@/shared/utils/formatters'

export function StatsCards({ report }: { report: Report }) {
  const stats = [
    { label: 'Estrellas', value: formatNumber(report.stars) },
    { label: 'Forks', value: formatNumber(report.forks) },
    { label: 'Licencia', value: report.license ?? 'Sin licencia' },
    { label: 'Creado', value: timeAgo(report.createdAt) },
  ]
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <p className="text-sm text-muted">Reporte de</p>
        <h1 className="mt-1 font-mono text-2xl font-medium tracking-tight wrap-anywhere sm:text-3xl">
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-4 transition duration-200 hover:text-accent-2 hover:decoration-accent-2"
          >
            {report.repo}
          </a>
        </h1>
        <p className="mt-2 text-muted">{report.description ?? 'Este repositorio no tiene descripción.'}</p>
        <p className="mt-3 text-sm text-muted">
          Creado el <span className="font-mono text-text">{formatDate(report.createdAt)}</span>
        </p>
      </Card>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={s.label} className="p-4" delay={(i + 1) * 70}>
            <p className="text-sm text-muted">{s.label}</p>
            <p className="mt-1 font-mono text-lg font-medium md:text-xl">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
