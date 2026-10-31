import { Card } from '@/shared/components/Card'

export function IssuesCard({ issues }: { issues: { open: number; closed: number } }) {
  const total = issues.open + issues.closed
  return (
    <Card>
      <h3 className="font-semibold">Issues</h3>
      {total === 0 ? (
        <p className="mt-4 text-sm text-muted">Sin issues registrados.</p>
      ) : (
        <>
          <div className="mt-4 flex gap-8 font-mono">
            <p><span className="text-3xl font-medium text-warn">{issues.open}</span><span className="block text-sm text-muted">abiertos</span></p>
            <p><span className="text-3xl font-medium text-accent">{issues.closed}</span><span className="block text-sm text-muted">cerrados</span></p>
          </div>
          <div className="mt-4 flex h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="bg-accent" style={{ width: `${(issues.closed / total) * 100}%` }} />
            <div className="bg-warn" style={{ width: `${(issues.open / total) * 100}%` }} />
          </div>
        </>
      )}
    </Card>
  )
}
