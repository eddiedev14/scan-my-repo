import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { TooltipContentProps } from 'recharts'
import { Card } from '@/shared/components/Card'
import type { Language } from '@/shared/types'
import { formatPercent } from '@/shared/utils/formatters'
import { LANGUAGE_COLORS, MAX_VISIBLE } from '@/features/report/constants/languages.constant'

const colorOf = (name: string, i: number) =>
  name === 'Otros' ? 'var(--color-chart-8)' : (LANGUAGE_COLORS[name] ?? `var(--color-chart-${(i % MAX_VISIBLE) + 1})`)

function LanguageTooltip({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-button border border-border bg-surface px-3 py-2 text-sm text-text">
      {payload[0].name} · <span className="font-mono">{formatPercent(Number(payload[0].value))}</span>
    </div>
  )
}

export function LanguagesChart({ languages }: { languages: Language[] }) {
  const rest = languages.slice(MAX_VISIBLE)
  const grouped = rest.length
    ? [
        ...languages.slice(0, MAX_VISIBLE),
        { name: 'Otros', percent: +rest.reduce((s, l) => s + l.percent, 0).toFixed(1) },
      ]
    : languages
  // Recharts toma el color de cada segmento del campo fill
  const items = grouped.map((l, i) => ({ ...l, fill: colorOf(l.name, i) }))
  return (
    <Card>
      <h3 className="font-semibold">Lenguajes</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No se detectaron lenguajes en este repositorio.</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
          <div className="h-60 w-full max-w-60 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="percent"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="95%"
                  startAngle={90}
                  endAngle={-270}
                  // Con un solo lenguaje el borde dibujaría una raya donde se cierra el anillo
                  stroke={items.length > 1 ? 'var(--color-surface)' : 'none'}
                  strokeWidth={2}
                />
                <Tooltip content={LanguageTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-2 text-sm">
            {items.map((l) => (
              <li key={l.name} className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: l.fill }} />
                <span className="truncate">{l.name}</span>
                <span className="ml-auto shrink-0 font-mono text-muted">{formatPercent(l.percent)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
