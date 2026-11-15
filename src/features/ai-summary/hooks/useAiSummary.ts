import { useEffect, useState } from 'react'
import type { AiResult, AppError, Report } from '@/shared/types'
import { getAiSummary } from '../actions/summarize'

interface Result {
  repo: string
  data: AiResult | null
  error: AppError | null
}

export function useAiSummary(report: Report | null): {
  data: AiResult | null
  loading: boolean
  error: AppError | null
} {
  const [result, setResult] = useState<Result | null>(null)

  // Un repo vacío no se analiza
  const shouldAsk = report !== null && !report.isEmptyRepo

  useEffect(() => {
    if (!shouldAsk) return
    let cancelled = false

    getAiSummary(report)
      .then((data) => !cancelled && setResult({ repo: report.repo, data, error: null }))
      .catch((error: AppError) => !cancelled && setResult({ repo: report.repo, data: null, error }))

    return () => {
      cancelled = true
    }
  }, [report])

  const current = result && report && result.repo === report.repo ? result : null
  return { data: current?.data ?? null, loading: shouldAsk && !current, error: current?.error ?? null }
}
