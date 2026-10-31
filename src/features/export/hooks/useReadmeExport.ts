import type { AiResult, Report } from '@/shared/types'

// Stub. TODO: generar un .md con el reporte y el resultado de la IA y descargarlo.
export function useReadmeExport() {
  return { exportReadme: (_report: Report, _ia: AiResult | null) => {} }
}
