import { useNavigate } from 'react-router-dom'
import { SearchBar } from '@/features/search'
import { HistoryPanel } from '@/features/history'
import { Card } from '@/shared/components/Card'
import { Reveal } from '@/shared/components/Reveal'
import { EXAMPLES, FEATURES, SAMPLE_HISTORY } from '@/shared/constants/HomePage.constant'

export default function HomePage() {
  const navigate = useNavigate()
  const goToReport = (repo: string) => navigate(`/report/${repo}`)

  return (
    <>
      <section className="flex flex-col items-center gap-6 pb-16 pt-14 text-center sm:pt-24">
        <Reveal className="max-w-3xl">
          <h1 className="text-4xl font-bold leading-[1.1] tracking-[-0.035em] sm:text-6xl">
            <span className="rounded-full bg-accent px-4 text-bg sm:px-6">Escanea</span> cualquier repositorio de GitHub
          </h1>
        </Reveal>
        <Reveal delay={100} className="max-w-xl">
          <p className="text-lg text-muted">
            Pega usuario/repo o la URL y obtén un reporte visual con resumen, calificación y mejoras hechos por IA.
          </p>
        </Reveal>
        <Reveal delay={200} className="mt-2 w-full max-w-2xl text-left">
          <SearchBar onSearch={goToReport} />
        </Reveal>
        <Reveal delay={300} className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted">
          Prueba con
          {EXAMPLES.map((repo) => (
            <button
              key={repo}
              onClick={() => goToReport(repo)}
              className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-text transition duration-200 hover:border-accent hover:text-accent"
            >
              {repo}
            </button>
          ))}
        </Reveal>
      </section>

      <section className="py-12">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight">Qué obtienes</h2>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Card
              key={f.title}
              className="card-invert hover:-translate-y-0.5"
              delay={i * 80}
              // Cada tarjeta lleva un tinte plano de la paleta de gráficas, como notas adhesivas
              style={{ background: `color-mix(in oklab, var(--color-chart-${i + 1}) 9%, var(--color-surface))` }}
            >
              {/* Mezcla con --color-text para que el número también se oscurezca en el hover blanco */}
              <span
                className="font-mono text-sm"
                style={{ color: `color-mix(in oklab, var(--color-chart-${i + 1}) 70%, var(--color-text))` }}
              >
                0{i + 1}
              </span>
              <h3 className="mt-3 text-lg font-semibold leading-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12">
        <HistoryPanel entries={SAMPLE_HISTORY} onSelect={(e) => goToReport(e.repo)} />
      </section>

      <Reveal>
        <footer className="border-t border-border py-8 text-center text-sm text-muted">
          Proyecto Informático · UAO · 2026
        </footer>
      </Reveal>
    </>
  )
}
