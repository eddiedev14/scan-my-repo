import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { Card } from '@/shared/components/Card'
import type { WeeklyCommits } from '@/shared/types'
import { formatDate, formatMonth } from '@/shared/utils/formatters'

// getCommits pide máximo 100 commits
const MAX_COMMITS = 100
const tickStyle = { fill: 'var(--color-muted)', fontSize: 12 }

// Cada semana es del mes de su lunes ("AAAA-MM" del ISO, ya en UTC). La primera semana de cada mes lleva la etiqueta,
// con año en la primera y cuando cambia; los meses alternan tono (fillOpacity se mezcla sobre las props de <Bar>)
function groupByMonth(data: WeeklyCommits[]) {
  const labels: Record<string, string> = {}
  let prev = ''
  let months = 0
  const bars = data.map((d) => {
    if (d.week.slice(0, 7) !== prev.slice(0, 7)) {
      labels[d.week] = formatMonth(d.week, d.week.slice(0, 4) !== prev.slice(0, 4))
      prev = d.week
      months++
    }
    return { ...d, fillOpacity: months % 2 ? 1 : 0.6 }
  })
  return { bars, labels }
}

function CommitsTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  const commits = Number(payload[0].value)
  return (
    <div className="rounded-button border border-border bg-surface px-3 py-2 font-sans text-sm text-text">
      Semana del {formatDate(String(label))} ·{' '}
      <span className="font-mono">
        {commits} {commits === 1 ? 'commit' : 'commits'}
      </span>
    </div>
  )
}

export function CommitsChart({ data }: { data: WeeklyCommits[] }) {
  const total = data.reduce((sum, d) => sum + d.commits, 0)
  const { bars, labels } = groupByMonth(data)
  return (
    <Card>
      <h3 className="font-semibold">Commits por semana</h3>
      {data.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Este repositorio no tiene commits recientes.</p>
      ) : (
        <>
          <p className="text-sm text-muted">
            {total === 1 ? 'Último commit' : `Últimos ${total} commits, agrupados por semana`}
            {total === MAX_COMMITS && ' (GitHub entrega los últimos 100)'}
          </p>
          {/* font-mono lo heredan las etiquetas de los ejes */}
          <div className="mt-4 h-[260px] font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                {/* Solo la primera semana de cada mes es tick; Recharts oculta las que chocarían */}
                <XAxis
                  dataKey="week"
                  ticks={Object.keys(labels)}
                  tickFormatter={(week: string) => labels[week]}
                  interval="preserveStartEnd"
                  minTickGap={8}
                  tickMargin={6}
                  tick={tickStyle}
                  tickLine={false}
                  axisLine={{ stroke: 'var(--color-border)' }}
                />
                <YAxis allowDecimals={false} width={32} tick={tickStyle} tickLine={false} axisLine={false} />
                <Tooltip content={CommitsTooltip} cursor={{ fill: 'var(--color-surface-2)' }} />
                <Bar dataKey="commits" fill="var(--color-accent)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  )
}
