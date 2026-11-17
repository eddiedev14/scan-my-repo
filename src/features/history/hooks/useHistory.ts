import { useLocalStorage } from '@/shared/hooks/useLocalStorage'
import type { AiResult, HistoryEntry, Report } from '@/shared/types'

const STORAGE_KEY = 'scanmyrepo:history'
const MAX_README = 100_000 // caracteres, para no acercarse al límite de ~5 MB del navegador
export const MAX_ENTRIES = 20

// Lo que viene del navegador puede estar corrupto o ser de otra versión
function isEntry(value: unknown): value is HistoryEntry {
  if (typeof value !== 'object' || value === null) return false
  const { id, repo, date, data, ia } = value as Partial<HistoryEntry>
  return (
    typeof id === 'string' &&
    typeof repo === 'string' &&
    typeof date === 'string' &&
    !Number.isNaN(Date.parse(date)) &&
    typeof data === 'object' &&
    data !== null &&
    (ia === null || typeof ia?.score === 'number')
  )
}

const toEntries = (value: unknown): HistoryEntry[] => (Array.isArray(value) ? value.filter(isEntry) : [])

// Historial de análisis, la más reciente primero
export function useHistory() {
  const [stored, setStored, removeStored] = useLocalStorage<unknown>(STORAGE_KEY, [])
  const entries = toEntries(stored)

  const add = (data: Report, ia: AiResult | null) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      repo: data.repo,
      date: new Date().toISOString(),
      data: { ...data, readme: data.readme?.slice(0, MAX_README) ?? null },
      ia,
    }
    // Un repo aparece una sola vez: la entrada vieja sale y la nueva queda primera
    const repo = data.repo.toLowerCase()
    const rest = entries.filter((e) => e.repo.toLowerCase() !== repo)
    setStored([entry, ...rest].slice(0, MAX_ENTRIES))
    return entry
  }

  const remove = (id: string) => setStored(entries.filter((e) => e.id !== id))

  return { entries, add, remove, clear: removeStored }
}
