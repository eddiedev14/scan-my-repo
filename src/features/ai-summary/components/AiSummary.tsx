import { Card } from '@/shared/components/Card'
import type { AiResult } from '@/shared/types'
import { ScoreMeter } from '@/features/ai-summary/components/ScoreMeter'

function List({ title, items, mark, color }: { title: string; items: string[]; mark: string; color: string }) {
  return (
    <div>
      <h4 className="text-sm font-medium text-muted">{title}</h4>
      <ul className="mt-2 flex flex-col gap-2 text-sm">
        {items.map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className={`font-mono ${color}`}>{mark}</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function AiSummary({ result }: { result: AiResult }) {
  return (
    <Card className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-[1fr_220px]">
        <div>
          <h3 className="font-semibold">Resumen con IA</h3>
          <p className="mt-3 leading-relaxed text-text/90">{result.summary}</p>
        </div>
        <ScoreMeter score={result.score} />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <List title="Fortalezas" items={result.strengths} mark="+" color="text-accent" />
        <List title="Para mejorar" items={result.improvements} mark="→" color="text-warn" />
      </div>
    </Card>
  )
}
