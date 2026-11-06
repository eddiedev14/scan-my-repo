import { Link, useParams } from 'react-router-dom'
import { AiSummary } from '@/features/ai-summary'
import { useExportReport, useReadmeExport } from '@/features/export'
import { CommitsChart, ContributorsList, IssuesCard, LanguagesChart, StatsCards, useRepoReport } from '@/features/report'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { Reveal } from '@/shared/components/Reveal'
import { Spinner } from '@/shared/components/Spinner'
import { mockAiResult } from '@/shared/mocks/aiResult.mock'

export default function ReportPage() {
  const { owner, repo } = useParams()
  const { data, loading, error } = useRepoReport(`${owner}/${repo}`)
  const { ref, exportPng, exporting } = useExportReport()
  const { exportReadme } = useReadmeExport()
  // Hasta que ai-summary exponga un hook por su barrel, la página usa el mock
  const ai = mockAiResult

  if (loading) return <div className="flex justify-center py-32"><Spinner className="size-10" /></div>
  if (error || !data) {
    return (
      <Card className="mt-12 text-center">
        <p className="text-danger">{error?.message ?? 'No pudimos cargar el reporte.'}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-accent-2 underline">Volver al inicio</Link>
      </Card>
    )
  }

  return (
    <div className="py-10">
      <Reveal className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPng} disabled={exporting}>Descargar PNG</Button>
          <Button variant="ghost" onClick={() => exportReadme(data, ai)}>Exportar README</Button>
        </div>
      </Reveal>

      <div ref={ref} className="mt-8 flex flex-col gap-4 bg-bg">
        <StatsCards report={data} />
        {data.isEmptyRepo ? (
          <Card>
            <p className="font-semibold">Este repositorio todavía no tiene commits</p>
            <p className="mt-1 text-sm text-muted">Cuando tenga actividad, aquí verás lenguajes, commits y contribuidores.</p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <LanguagesChart languages={data.languages} />
              <CommitsChart data={data.commitsPerWeek} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ContributorsList contributors={data.contributors} />
              <IssuesCard issues={data.issues} />
            </div>
            <AiSummary result={ai} />
          </>
        )}
      </div>
    </div>
  )
}
