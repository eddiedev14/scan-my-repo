const isObject = (v) => typeof v === 'object' && v !== null && !Array.isArray(v)
const isCount = (v) => typeof v === 'number' && Number.isFinite(v) && v >= 0
const isTextOrNull = (v) => v === null || typeof v === 'string'

// Revisa el body y devuelve { data, invalid }. Si invalid tiene nombres, no hay data
export function validatePayload(b) {
  if (!isObject(b)) return { data: null, invalid: ['cuerpo'] }

  const checks = {
    repo: typeof b.repo === 'string' && /^[\w.-]+\/[\w.-]+$/.test(b.repo),
    descripcion: isTextOrNull(b.descripcion),
    estrellas: isCount(b.estrellas),
    forks: isCount(b.forks),
    licencia: isTextOrNull(b.licencia),
    creado: typeof b.creado === 'string',
    ultimoPush: typeof b.ultimoPush === 'string',
    lenguajes: isObject(b.lenguajes),
    contribuidores: isCount(b.contribuidores),
    commitsRecientes: isCount(b.commitsRecientes),
    issuesAbiertos: isCount(b.issuesAbiertos),
    issuesCerrados: isCount(b.issuesCerrados),
    readme: isTextOrNull(b.readme),
  }

  const invalid = Object.keys(checks).filter((k) => !checks[k])
  if (invalid.length) return { data: null, invalid }

  return {
    invalid,
    data: {
      repo: b.repo,
      descripcion: b.descripcion,
      estrellas: b.estrellas,
      forks: b.forks,
      licencia: b.licencia,
      creado: b.creado,
      ultimoPush: b.ultimoPush,
      lenguajes: b.lenguajes,
      contribuidores: b.contribuidores,
      commitsRecientes: b.commitsRecientes,
      issuesAbiertos: b.issuesAbiertos,
      issuesCerrados: b.issuesCerrados,
      readme: (b.readme ?? '').slice(0, 4000), // Máximo 4000 caracteres
    },
  }
}

// La IA a veces envuelve el JSON en ```json ... ``` o agrega texto: se intenta rescatar una vez
export function parseModelJSON(text) {
  const clean = String(text ?? '')
    .replace(/```(?:json)?/gi, '')
    .trim()

  try {
    return JSON.parse(clean)
  } catch {}

  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(clean.slice(start, end + 11))
    } catch {}
  }

  return null
}

const cleanList = (list) =>
  Array.isArray(list)
    ? list
        .filter((s) => typeof s === 'string' && s.trim())
        .map((s) => s.trim())
        .slice(0, 5)
    : []

// Devuelve los 4 campos limpios o null si la respuesta está incompleta
export function cleanResult(raw) {
  if (!isObject(raw)) return null
  const resumen = typeof raw.resumen === 'string' ? raw.resumen.trim() : ''
  const fortalezas = cleanList(raw.fortalezas)
  const mejoras = cleanList(raw.mejoras)
  const n = Number(raw.calificacion)
  if (!resumen || !fortalezas.length || !mejoras.length) return null
  if (raw.calificacion === null || raw.calificacion === '' || Number.isNaN(n)) return null
  const calificacion = Math.round(Math.min(5, Math.max(1, n)) * 10) / 10 // Forzar formato decimal
  return { resumen, calificacion, fortalezas, mejoras }
}
