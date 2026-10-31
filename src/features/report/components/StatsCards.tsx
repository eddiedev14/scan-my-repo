import { Card } from '@/shared/components/Card'
import type { Report } from '@/shared/types'

export function StatsCards({ report }: { report: Report }) {
  const stats = [
    { label: 'Estrellas', value: report.stars },
    { label: 'Forks', value: report.forks },
    { label: 'Licencia', value: report.license ?? 'Sin licencia' },
    { label: 'Creado', value: report.createdAt },
  ]
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((s, i) => (
        <Card key={s.label} className="p-4" delay={i * 70}>
          <p className="text-sm text-muted">{s.label}</p>
          <p className="mt-1 font-mono text-xl font-medium">{s.value}</p>
        </Card>
      ))}
    </div>
  )
}
