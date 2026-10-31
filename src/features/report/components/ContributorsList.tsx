import { Card } from '@/shared/components/Card'
import type { Contributor } from '@/shared/types'

export function ContributorsList({ contributors }: { contributors: Contributor[] }) {
  return (
    <Card>
      <h3 className="font-semibold">Contribuidores</h3>
      {contributors.length === 0 ? (
        <p className="mt-4 text-sm text-muted">Todavía no hay contribuidores.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {contributors.map((c) => (
            <li key={c.user} className="flex items-center gap-3 text-sm">
              <img src={c.avatar} alt="" width={28} height={28} loading="lazy" className="size-7 rounded-full bg-surface-2" />
              <span className="truncate font-mono">{c.user}</span>
              <span className="ml-auto font-mono text-muted">{c.commits} commits</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
