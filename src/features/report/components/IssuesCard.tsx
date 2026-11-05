import { Card } from '@/shared/components/Card'

// getIssues pide máximo 100 por página
const MAX_ISSUES = 100

export function IssuesCard({ issues }: { issues: { open: number; closed: number } }) {
  const total = issues.open + issues.closed
  const resolved = total === 0 ? 0 : Math.round((issues.closed / total) * 100)
  return (
    <Card>
      <h3 className="font-semibold">Issues</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-muted">Este repositorio no tiene issues.</p>
      ) : (
        <>
          <div className="mt-4 flex gap-10">
            <p>
              <span className="block font-mono text-4xl font-medium text-warn">{issues.open}</span>
              <span className="text-sm text-muted">Abiertos</span>
            </p>
            <p>
              <span className="block font-mono text-4xl font-medium text-accent">{issues.closed}</span>
              <span className="text-sm text-muted">Cerrados</span>
            </p>
          </div>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="grow-x h-full rounded-full bg-accent" style={{ width: `${resolved}%` }} />
          </div>
          <p className="mt-2 text-sm">
            <span className="font-mono">{resolved}&nbsp;%</span> resueltos
          </p>
          <p className="mt-4 text-xs text-muted">
            Solo issues, sin pull requests.
            {total >= MAX_ISSUES && ' Se analizaron hasta 100 issues.'}
          </p>
        </>
      )}
    </Card>
  )
}
