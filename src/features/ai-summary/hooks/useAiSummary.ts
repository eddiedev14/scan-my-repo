import { mockAiResult } from '@/shared/mocks/aiResult.mock'
import type { AiResult, AppError, Report } from '@/shared/types'

export function useAiSummary(report: Report | null): {
  data: AiResult | null
  loading: boolean
  error: AppError | null
} {
  return { data: mockAiResult, loading: false, error: null }
}
