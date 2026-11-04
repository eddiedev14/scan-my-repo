import { useEffect, useRef, useState } from 'react'
import { getReport, toGithubError } from '@/features/report/actions/github'
import type { AppError, Report } from '@/shared/types'

interface State {
  data: Report | null
  loading: boolean
  error: AppError | null
}

export function useRepoReport(repo: string): State {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null })
  // Cada consulta lleva un número; si llega una respuesta de una consulta vieja, se ignora
  const requestId = useRef(0)

  useEffect(() => {
    const id = ++requestId.current
    setState({ data: null, loading: true, error: null })

    const [owner, name] = repo.split('/')
    getReport(owner, name)
      .then((data) => {
        if (id === requestId.current) setState({ data, loading: false, error: null })
      })
      .catch((err) => {
        if (id === requestId.current) setState({ data: null, loading: false, error: toGithubError(err) })
      })

    // Al cambiar de repo o desmontar, la respuesta pendiente queda obsoleta
    return () => {
      requestId.current++
    }
  }, [repo])

  return state
}