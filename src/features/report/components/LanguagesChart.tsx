import { Card } from '@/shared/components/Card'
import type { Language } from '@/shared/types'
import { LANGUAGE_COLORS, MAX_VISIBLE } from '@/features/report/constants/languages.constant'

const colorOf = (name: string, i: number) =>
  name === 'Otros' ? 'var(--color-chart-8)' : (LANGUAGE_COLORS[name] ?? `var(--color-chart-${(i % MAX_VISIBLE) + 1})`)

// Placeholder CSS. TODO: reemplazar por una gráfica de recharts.
export function LanguagesChart({ languages }: { languages: Language[] }) {
  const rest = languages.slice(MAX_VISIBLE)
  const items = rest.length
    ? [
        ...languages.slice(0, MAX_VISIBLE),
        { name: 'Otros', percent: +rest.reduce((s, l) => s + l.percent, 0).toFixed(1) },
      ]
    : languages
  return (
    <Card>
      <h3 className="font-semibold">Lenguajes</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No se detectaron lenguajes.</p>
      ) : (
        <>
          {/* flex-grow en vez de width: los segmentos siempre llenan el 100% de la barra */}
          <div className="mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full bg-surface-2">
            {items.map((l, i) => (
              <div
                key={l.name}
                className="grow-x min-w-0.5"
                style={{ flex: `${l.percent} 1 0`, background: colorOf(l.name, i), animationDelay: `${i * 70}ms` }}
                title={`${l.name} ${l.percent}%`}
              />
            ))}
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {items.map((l, i) => (
              <li key={l.name} className="flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ background: colorOf(l.name, i) }} />
                <span className="truncate">{l.name}</span>
                <span className="ml-auto font-mono text-muted">{l.percent}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}
