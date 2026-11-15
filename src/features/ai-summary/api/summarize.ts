import axios, { isAxiosError } from 'axios'
import type { AppError } from '@/shared/types'

export const summarizeApi = axios.create({ timeout: 4000 })

const DEFAULT_MESSAGE = 'No pudimos generar el resumen con AI'

function toAppError(error: unknown): AppError {
  if (!isAxiosError(error)) return { type: 'UNKNOWN', message: DEFAULT_MESSAGE }

  // Sin respuesta: Worker apagado, sin internet o timeout de 40 s
  if (!error.response) return { type: 'NETWORK', message: 'No pudimos conectar con el servicio de IA.' }
  const { status, data } = error.response
  const type: AppError['type'] = status === 429 ? 'RATE_LIMIT' : status >= 500 ? 'SERVER' : 'UNKNOWN'
  // El Worker siempre responde { error: "mensaje en español" }
  const message = typeof data?.error === 'string' ? data.error : DEFAULT_MESSAGE
  return { type, message, status }
}

// Interceptor que se ejeucta antes de recibir una respuesta. Lo que hace es devolver siempre un AppError
summarizeApi.interceptors.response.use(undefined, (error) => Promise.reject(toAppError(error)))
