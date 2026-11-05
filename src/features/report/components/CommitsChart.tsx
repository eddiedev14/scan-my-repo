import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { Card } from '@/shared/components/Card'
import type { WeeklyCommits } from '@/shared/types'
import { formatDate, formatMonth } from '@/shared/utils/formatters'

// getCommits pide máximo 100 commits
const MAX_COMMITS = 100
// Con más barras, a 375 px cada una mide menos de 8 px
const MAX_BARS = 26
const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const tickStyle = { fill: 'var(--color-muted)', fontSize: 12 }

// Lunes (UTC) de la semana actual, en milisegundos
function currentMonday() {
  const now = new Date()
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ((now.getUTCDay() + 6) % 7))
}

// Las últimas MAX_BARS semanas hasta la actual. La serie termina en la semana del último commit, así que las semanas
// posteriores se rellenan con 0 (no hubo commits). Las anteriores al commit más viejo que llegó no se dibujan:
// GitHub entrega solo los últimos 100 y no sabemos qué pasó antes
function lastWeeks(data: WeeklyCommits[]): WeeklyCommits[] {
  if (data.length === 0) return []
  const counts = new Map(data.map((d) => [d.week, d.commits]))
  const end = currentMonday()
  const start = Math.max(Date.parse(`${data[0].week}T00:00:00Z`), end - (MAX_BARS - 1) * WEEK_MS)
  const weeks: WeeklyCommits[] = []
  for (let t = start; t <= end; t += WEEK_MS) {
    const week = new Date(t).toISOString().slice(0, 10)
    weeks.push({ week, commits: counts.get(week) ?? 0 })
  }
  return weeks
}

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
  const weeks = lastWeeks(data)
  const shown = weeks.reduce((sum, d) => sum + d.commits, 0)
  // Con el tope de 100 y menos de MAX_BARS semanas cubiertas, puede haber commits más viejos que no llegaron
  const capped = data.reduce((sum, d) => sum + d.commits, 0) === MAX_COMMITS && weeks.length < MAX_BARS
  const { bars, labels } = groupByMonth(weeks)
  return (
    <Card>
      <h3 className="font-semibold">Commits por semana</h3>
      {shown === 0 ? (
        <p className="mt-4 text-sm text-muted">Este repositorio no tiene commits en las últimas {MAX_BARS} semanas.</p>
      ) : (
        <>
          <p className="text-sm text-muted">
            {shown} {shown === 1 ? 'commit' : 'commits'} en{' '}
            {weeks.length === 1 ? 'la última semana' : `las últimas ${weeks.length} semanas`}
            {capped && ' (GitHub entrega como máximo los últimos 100)'}
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
