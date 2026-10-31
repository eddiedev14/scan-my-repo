import type { AiResult, HistoryEntry, Report } from '@/shared/types'

// Stub sin persistencia. TODO: guardar en localStorage con useLocalStorage (máx. N entradas).
export function useHistory() {
  return {
    entries: [] as HistoryEntry[],
    add: (_data: Report, _ia: AiResult | null) => {},
    remove: (_id: string) => {},
    clear: () => {},
  }
}
