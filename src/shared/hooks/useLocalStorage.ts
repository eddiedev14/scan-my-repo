import { useState } from 'react'

// Stub: por ahora solo estado en memoria. Falta leer/escribir en localStorage (try/catch incluido).
export function useLocalStorage<T>(_key: string, initial: T) {
  return useState<T>(initial)
}
