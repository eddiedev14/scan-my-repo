import { Link, useParams } from 'react-router-dom'
import { AiSummary, useAiSummary } from '@/features/ai-summary'
import { useExportReport, useReadmeExport } from '@/features/export'
import {
  CommitsChart,
  ContributorsList,
  IssuesCard,
  LanguagesChart,
  StatsCards,
  useRepoReport,
} from '@/features/report'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { Reveal } from '@/shared/components/Reveal'
import { Spinner } from '@/shared/components/Spinner'
import type { AiResult, AppError, Report } from '@/shared/types'

export default function ReportPage() {
  const { owner, repo } = useParams()
  return <LiveReport repo={`${owner}/${repo}`} />
}

// Análisis en vivo: consulta GitHub y la IA, y muestra el spinner o el error mientras tanto
function LiveReport({ repo }: { repo: string }) {
  const { data: report, loading: loadingData, error: errorData } = useRepoReport(repo)
  const { data: ai, loading: loadingAi, error: errorAi } = useAiSummary(report)

  // Calculated values
  const loading = loadingData || loadingAi

  if (loading)
    return (
      <div className="flex justify-center py-32">
        <Spinner className="size-10" />
      </div>
    )
  if (errorData || !report) {
    return (
      <Card className="mt-12 text-center">
        <p className="text-danger">{errorData?.message ?? 'No pudimos cargar el reporte.'}</p>
        <Link to="/" className="mt-3 inline-block text-sm text-accent-2 underline">
          Volver al inicio
        </Link>
      </Card>
    )
  }

  return <ReportView report={report} ai={ai} errorAi={errorAi} />
}

interface ViewProps {
  report: Report
  ai: AiResult | null
  errorAi: AppError | null
}

// El reporte ya cargado, con sus botones de exportar
function ReportView({ report, ai, errorAi }: ViewProps) {
  const { ref, exportPng, exporting } = useExportReport()
  const { exportReadme } = useReadmeExport()

  return (
    <div className="py-10">
      <Reveal className="flex justify-end">
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportPng} disabled={exporting}>
            Descargar PNG
          </Button>
          <Button variant="ghost" onClick={() => exportReadme(report, ai)}>
            Exportar README
          </Button>
        </div>
      </Reveal>

      <div ref={ref} className="mt-8 flex flex-col gap-4 bg-bg">
        <StatsCards report={report} />
        {report.isEmptyRepo ? (
          <Card>
            <p className="font-semibold">Este repositorio todavía no tiene commits</p>
            <p className="mt-1 text-sm text-muted">
              Cuando tenga actividad, aquí verás lenguajes, commits y contribuidores.
            </p>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              <LanguagesChart languages={report.languages} />
              <CommitsChart data={report.commitsPerWeek} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ContributorsList contributors={report.contributors} />
              <IssuesCard issues={report.issues} />
            </div>

            {errorAi || !ai ? (
              <Card className="mt-12 text-center">
                <p className="text-danger">{errorAi?.message ?? 'No pudimos cargar el resumen con AI.'}</p>
                <Link to="/" className="mt-3 inline-block text-sm text-accent-2 underline">
                  Volver al inicio
                </Link>
              </Card>
            ) : (
              <AiSummary result={ai} />
            )}
          </>
        )}
      </div>
    </div>
  )
}
