import { Card } from '@/shared/components/Card'
import type { Contributor } from '@/shared/types'

export function ContributorsList({ contributors }: { contributors: Contributor[] }) {
  // El 1 evita dividir entre 0 si todos tienen 0 commits
  const max = Math.max(1, ...contributors.map((c) => c.commits))
  // min-w-0: en móvil el grid de ReportPage no limita el ancho y un usuario largo ensancharía la columna
  return (
    <Card className="min-w-0">
      <h3 className="font-semibold">Contribuidores</h3>
      {contributors.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No hay contribuidores para mostrar.</p>
      ) : (
        <ol className="mt-4 flex flex-col gap-4">
          {contributors.map((c, i) => (
            <li key={c.user} className="flex items-center gap-3">
              <span className="w-5 shrink-0 text-right font-mono text-sm text-muted">{i + 1}</span>
              <img
                src={c.avatar}
                alt={c.user}
                width={40}
                height={40}
                loading="lazy"
                className="size-10 shrink-0 rounded-full bg-surface-2"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3 text-sm">
                  <a
                    href={`https://github.com/${c.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate font-mono transition duration-200 hover:text-accent-2"
                  >
                    {c.user}
                  </a>
                  <span className="ml-auto shrink-0 font-mono text-muted">
                    {c.commits} {c.commits === 1 ? 'commit' : 'commits'}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="grow-x h-full rounded-full bg-accent"
                    style={{ width: `${(c.commits / max) * 100}%`, animationDelay: `${i * 50}ms` }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Card>
  )
}
