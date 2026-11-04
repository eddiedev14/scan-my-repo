import axios, { isAxiosError } from 'axios'
import type { AppError } from '@/shared/types'

export const githubApi = axios.create({
  baseURL: 'https://api.github.com',
  headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
})

const DEFAULT_MESSAGES: Record<AppError['type'], string> = {
  NETWORK: 'No pudimos conectar con GitHub. Revisa tu conexión.',
  NOT_FOUND: 'No encontramos lo que buscabas en GitHub.',
  RATE_LIMIT: 'Alcanzaste el límite de consultas de GitHub.',
  SERVER: 'GitHub tuvo un problema. Intenta de nuevo en un momento.',
  UNKNOWN: 'No pudimos consultar GitHub. Intenta de nuevo.',
}

export function isAppError(value: unknown): value is AppError {
  return typeof value === 'object' && value !== null && 'type' in value && 'message' in value
}

// GitHub avisa del límite con 403/429 + x-ratelimit-remaining: 0 (o retry-after en el límite secundario)
function isRateLimited(status: number, headers: Record<string, unknown>, data: unknown) {
  if (status !== 403 && status !== 429) return false
  if (headers['x-ratelimit-remaining'] === '0' || headers['retry-after'] !== undefined) return true
  const message = (data as { message?: string } | undefined)?.message
  return typeof message === 'string' && /rate limit/i.test(message)
}

function toAppError(error: unknown): AppError {
  if (!isAxiosError(error)) return { type: 'UNKNOWN', message: DEFAULT_MESSAGES.UNKNOWN }
  // Sin respuesta: sin internet, DNS, CORS o timeout
  if (!error.response) return { type: 'NETWORK', message: DEFAULT_MESSAGES.NETWORK }

  const { status, data } = error.response
  const headers = { ...error.response.headers } as Record<string, unknown>
  const type: AppError['type'] = isRateLimited(status, headers, data)
    ? 'RATE_LIMIT'
    : status === 404
      ? 'NOT_FOUND'
      : status >= 500
        ? 'SERVER'
        : 'UNKNOWN'
  return { type, message: DEFAULT_MESSAGES[type], status, headers }
}

// Todo error de esta instancia sale como AppError
githubApi.interceptors.response.use(undefined, (error) => Promise.reject(toAppError(error)))