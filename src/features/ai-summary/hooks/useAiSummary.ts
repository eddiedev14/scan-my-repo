import { mockAiResult } from '@/shared/mocks/aiResult.mock'
import type { AiResult, AppError, Report } from '@/shared/types'

// Stub: devuelve el mock. TODO: llamar a getAiSummary(report) con loading/error reales.
export function useAiSummary(_report: Report | null): { data: AiResult | null; loading: boolean; error: AppError | null } {
  return { data: mockAiResult, loading: false, error: null }
}
