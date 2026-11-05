import { Card } from '@/shared/components/Card'
import type { WeeklyCommits } from '@/shared/types'
import { formatShortDate as weekLabel } from '@/shared/utils/formatters'

const MAX_WEEKS = 6

// Placeholder CSS. TODO: reemplazar por una gráfica de recharts.
export function CommitsChart({ data }: { data: WeeklyCommits[] }) {
  const weeks = data.slice(-MAX_WEEKS)
  const max = Math.max(1, ...weeks.map((d) => d.commits))
  return (
    <Card>
      <h3 className="font-semibold">Commits por semana</h3>
      <p className="text-sm text-muted">Últimas {MAX_WEEKS} semanas, cada una desde su lunes</p>
      {weeks.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Sin actividad para mostrar.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-6 gap-2">
          {weeks.map((d, i) => (
            <li
              key={d.week}
              className="flex flex-col items-center gap-1.5"
              title={`Semana del ${weekLabel(d.week)}: ${d.commits} commits`}
            >
              <span className="font-mono text-sm">{d.commits}</span>
              <div className="flex h-28 w-full items-end">
                <div
                  className="grow-y w-full rounded-t-sm bg-accent"
                  style={{ height: `${Math.max(4, (d.commits / max) * 100)}%`, animationDelay: `${i * 80}ms` }}
                />
              </div>
              <span className="whitespace-nowrap text-[11px] text-muted">{weekLabel(d.week)}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
