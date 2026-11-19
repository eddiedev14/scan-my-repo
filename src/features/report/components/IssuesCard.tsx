import { Card } from '@/shared/components/Card'

// getIssues pide una sola página de 100 registros y GitHub mezcla issues y PR; después de quitar los PR
// no se sabe si hubo recorte, por eso la nota se muestra siempre
const MAX_ISSUES = 100
const NOTE = `Solo issues, sin pull requests. Se analizan los últimos ${MAX_ISSUES} registros de GitHub (issues y pull requests).`

export function IssuesCard({ issues }: { issues: { open: number; closed: number } }) {
  const total = issues.open + issues.closed
  const resolved = total === 0 ? 0 : Math.round((issues.closed / total) * 100)
  // self-start: en el grid de dos columnas la tarjeta no se estira a la altura de Contribuidores
  return (
    <Card className="self-start">
      <h3 className="font-semibold">Issues</h3>
      {total === 0 ? (
        <>
          <p className="mt-4 text-sm text-muted">Este repositorio no tiene issues.</p>
          <p className="mt-2 text-xs text-muted">{NOTE}</p>
        </>
      ) : (
        <>
          <dl className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm text-muted">Abiertos</dt>
              <dd className="mt-1 font-mono text-4xl font-medium text-warn">{issues.open}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">Cerrados</dt>
              <dd className="mt-1 font-mono text-4xl font-medium text-accent">{issues.closed}</dd>
            </div>
          </dl>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="grow-x h-full rounded-full bg-accent" style={{ width: `${resolved}%` }} />
          </div>
          <p className="mt-2 text-sm text-muted">
            <span className="font-mono">{resolved}&nbsp;%</span> resueltos
          </p>
          <p className="mt-4 text-xs text-muted">{NOTE}</p>
        </>
      )}
    </Card>
  )
}
