import { MAX_ENTRIES } from '@/features/history/hooks/useHistory'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import type { HistoryEntry } from '@/shared/types'
import { formatDateTime, formatNumber } from '@/shared/utils/formatters'

interface Props {
  entries: HistoryEntry[]
  onSelect: (entry: HistoryEntry) => void
  onClear: () => void
}

export function HistoryPanel({ entries, onSelect, onClear }: Props) {
  const confirmClear = () => {
    if (window.confirm('¿Borrar todo el historial?')) onClear()
  }

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-semibold">Historial</h3>
        <span className="font-mono text-xs text-muted">
          {entries.length}/{MAX_ENTRIES}
        </span>
      </div>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">Aún no has analizado ningún repositorio.</p>
      ) : (
        <>
          <ul className="mt-3 max-h-[360px] divide-y divide-border overflow-y-auto">
            {entries.map((e) => (
              <li key={e.id}>
                <button
                  onClick={() => onSelect(e)}
                  // Offset negativo para que el scroll de la lista no recorte el contorno del foco
                  className="flex w-full cursor-pointer items-center gap-3 rounded-button px-2 py-3 text-left transition duration-200 hover:bg-surface-2 focus-visible:-outline-offset-2"
                >
                  {/* min-w-0 deja que truncate funcione dentro del flex */}
                  <span className="min-w-0 flex-1">
                    <span title={e.repo} className="block truncate font-mono text-sm">
                      {e.repo}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-muted">
                      {formatDateTime(e.date)} ·{' '}
                      <span className="whitespace-nowrap">
                        <span aria-hidden="true">★</span> {formatNumber(e.data.stars)}
                        <span className="sr-only"> estrellas</span>
                      </span>
                    </span>
                  </span>
                  {e.ia ? (
                    <span className="shrink-0 rounded-full bg-accent/15 px-2 py-0.5 font-mono text-xs text-accent">
                      {e.ia.score.toFixed(1)}
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted">Sin IA</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <Button variant="outline" onClick={confirmClear} className="mt-4 cursor-pointer">
            Borrar historial
          </Button>
        </>
      )}
    </Card>
  )
}
