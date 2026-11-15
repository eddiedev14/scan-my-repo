import { useEffect, useState } from 'react'
import { getReport, toGithubError } from '@/features/report/actions/github'
import type { AiResult, AppError, Report } from '@/shared/types'

interface State {
  data: Report | null
  aiResult: AiResult | null
  loading: boolean
  error: AppError | null
}

export function useRepoReport(repo: string): State {
  const [state, setState] = useState<State>({ data: null, aiResult: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    setState({ data: null, aiResult: null, loading: true, error: null })

    const [owner, name] = repo.split('/')
    getReport(owner, name)
      .then((data) => {
        if (!cancelled) setState({ data, aiResult: null, loading: false, error: null })
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, aiResult: null, loading: false, error: toGithubError(err) })
      })

    // Al cambiar de repo o desmontar, la respuesta pendiente queda obsoleta
    return () => {
      cancelled = true;
    }
  }, [repo])

  return state
}
