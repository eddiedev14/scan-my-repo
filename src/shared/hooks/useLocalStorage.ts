import { useState } from 'react'

type SetValue<T> = (next: T | ((prev: T) => T)) => void

// Estado guardado en localStorage. Si el navegador lo bloquea o se llena la cuota, sigue funcionando en memoria
export function useLocalStorage<T>(key: string, initial: T): [T, SetValue<T>, () => void] {
  // Se lee una sola vez al montar: sin clave, con JSON corrupto o sin acceso al storage queda initial
  const [value, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw === null ? initial : (JSON.parse(raw) as T)
    } catch {
      return initial
    }
  })

  // El valor nuevo se calcula antes de setState para no escribir dentro del updater (StrictMode lo corre dos veces)
  // Usa el valor del último render: dos llamadas seguidas en el mismo evento se pisan
  const setValue: SetValue<T> = (next) => {
    const nextValue = next instanceof Function ? next(value) : next
    setState(nextValue)
    try {
      localStorage.setItem(key, JSON.stringify(nextValue))
    } catch (error) {
      console.warn(`No se pudo guardar "${key}" en localStorage`, error)
    }
  }

  // Vuelve a initial y elimina la clave (lo usa clear() del historial)
  const remove = () => {
    setState(initial)
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.warn(`No se pudo borrar "${key}" de localStorage`, error)
    }
  }

  return [value, setValue, remove]
}
