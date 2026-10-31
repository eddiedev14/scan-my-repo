import { useState } from 'react'
import type { FormEvent } from 'react'

// Acepta "usuario/repo", "github.com/usuario/repo" o la URL completa (con .git o subrutas)
const REPO_RE = /^(?:(?:https?:\/\/)?(?:www\.)?github\.com\/)?([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#].*)?$/i

export function parseRepo(input: string): string | null {
  const m = input.trim().match(REPO_RE)
  return m ? `${m[1]}/${m[2]}` : null
}

export function useSearchBar(onSearch: (repo: string) => void) {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const repo = parseRepo(value)
    if (!repo) return setError('Escribe algo como usuario/repo o pega la URL del repositorio.')
    setError(null)
    onSearch(repo)
  }

  return { value, setValue, error, submit }
}
