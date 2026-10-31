import { mockReport, mockReportEmpty, mockReportManyLanguages } from '@/shared/mocks/report.mock'
import type { AppError, Report } from '@/shared/types'

// Stub: devuelve mocks. Prueba los tres con usuario/repo: demo/repo-vacio y demo/muchos-lenguajes.
// TODO: llamar a getReport(repo) con loading/error reales.
export function useRepoReport(repo: string): { data: Report | null; loading: boolean; error: AppError | null } {
  const data = { 'demo/repo-vacio': mockReportEmpty, 'demo/muchos-lenguajes': mockReportManyLanguages }[repo] ?? mockReport
  return { data, loading: false, error: null }
}
