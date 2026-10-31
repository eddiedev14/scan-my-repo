// Cinco segmentos; el último se llena en proporción al decimal
export function ScoreMeter({ score }: { score: number }) {
  return (
    <div role="img" aria-label={`Calificación ${score.toFixed(1)} de 5`}>
      <p className="font-mono">
        <span className="text-5xl font-medium text-accent">{score.toFixed(1)}</span>
        <span className="text-muted"> / 5</span>
      </p>
      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-2 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-accent" style={{ width: `${Math.min(1, Math.max(0, score - i)) * 100}%` }} />
          </div>
        ))}
      </div>
    </div>
  )
}
