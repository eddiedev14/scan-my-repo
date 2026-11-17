function tone(score: number) {
  if (score < 2.5) return { color: 'var(--color-danger)', label: 'Necesita mejoras' }
  if (score < 4) return { color: 'var(--color-warn)', label: 'Aceptable' }
  return { color: 'var(--color-accent)', label: 'Muy bueno' }
}

export function ScoreMeter({ score }: { score: number }) {
  const { color, label } = tone(score)
  const filled = Math.min(1, Math.max(0, score / 5)) * 100
  return (
    <div role="img" aria-label={`Calificación ${score.toFixed(1)} de 5`} className="flex flex-col items-center gap-2">
      <div className="relative size-36">
        <svg viewBox="0 0 120 120" aria-hidden className="size-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="var(--color-surface-2)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - filled}
            className="score-arc"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono">
          <p className="flex items-baseline gap-1">
            <span className="text-4xl font-medium">{score.toFixed(1)}</span>
            <span className="text-sm text-muted">/ 5</span>
          </p>
        </div>
      </div>
      <p className="text-sm font-medium" style={{ color }}>
        {label}
      </p>
    </div>
  )
}
