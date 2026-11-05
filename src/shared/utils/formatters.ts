const DAY_MS = 24 * 60 * 60 * 1000

const numberFmt = new Intl.NumberFormat('es', { notation: 'compact' })
const percentFmt = new Intl.NumberFormat('es', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 })
const dateFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
const shortDateFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', timeZone: 'UTC' })

// "AAAA-MM-DD" se lee como medianoche UTC para que la zona horaria no corra el día
const toUtcDate = (iso: string) => new Date(`${iso}T00:00:00Z`)

// 1200 -> "1,2 mil"
export const formatNumber = (n: number) => numberFmt.format(n)

// 62.4 -> "62,4 %"
export const formatPercent = (n: number) => percentFmt.format(n / 100)

// "2026-10-28" -> "28 oct 2026"
export const formatDate = (iso: string) => dateFmt.format(toUtcDate(iso)).replace('.', '')

// "2026-10-28" -> "28 oct"
export const formatShortDate = (iso: string) => shortDateFmt.format(toUtcDate(iso)).replace('.', '')

const ago = (n: number, singular: string, plural: string) => `hace ${n} ${n === 1 ? singular : plural}`

// Por días completos de diferencia (en UTC): hoy, ayer, días, meses (de 30 días) o años
export function timeAgo(iso: string, now = new Date()): string {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const days = Math.floor((today - toUtcDate(iso).getTime()) / DAY_MS)
  if (days < 1) return 'hoy'
  if (days === 1) return 'ayer'
  if (days < 30) return ago(days, 'día', 'días')
  if (days < 365) return ago(Math.floor(days / 30), 'mes', 'meses')
  return ago(Math.floor(days / 365), 'año', 'años')
}
