import { Card } from '@/shared/components/Card'
import type { HistoryEntry } from '@/shared/types'

interface Props {
  entries: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
}

export function HistoryPanel({ entries, onSelect }: Props) {
  return (
    <Card>
      <h3 className="font-semibold">Historial</h3>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Aún no has escaneado nada. Tus búsquedas recientes aparecerán aquí.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border">
          {entries.map((e) => (
            <li key={e.id}>
              <button onClick={() => onSelect(e)} className="flex w-full items-center gap-3 rounded-button px-2 py-3 text-left transition duration-200 hover:bg-surface-2">
                <span className="truncate font-mono text-sm">{e.repo}</span>
                {e.ia && <span className="rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">{e.ia.score.toFixed(1)}</span>}
                <span className="ml-auto font-mono text-xs text-muted">{e.date}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
