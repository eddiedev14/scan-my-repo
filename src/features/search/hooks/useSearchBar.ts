import { useState } from 'react'
import type { FormEvent } from 'react'
import { parseRepo } from '@/features/search/utils/parseRepo'

export const INVALID_FORMAT_MESSAGE = 'Formato no válido. Usa usuario/repo o la URL de GitHub.'

export function useSearchBar(onSearch: (repo: string) => void, disabled = false) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Al volver a escribir desaparece el mensaje de error
  const change = (next: string) => {
    setValue(next)
    setError(null)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (disabled) return
    const parsed = parseRepo(value)
    if (!parsed) return setError(INVALID_FORMAT_MESSAGE)
    setError(null)
    onSearch(`${parsed.owner}/${parsed.repo}`)
  }

  return { value, setValue: change, error, submit }
}