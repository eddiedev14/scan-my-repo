export interface ParsedRepo {
  owner: string
  repo: string
}

const OWNER_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/
const REPO_RE = /^[A-Za-z0-9._-]{1,100}$/

// ¿El texto parece una URL o dominio? (http(s)://, www., github.com o git@github.com:)
const LOOKS_LIKE_URL_RE = /^(?:https?:\/\/|www\.|github\.com|git@github\.com)/i
// Prefijo válido de GitHub; el lookahead evita aceptar dominios como github.community
const GITHUB_PREFIX_RE = /^(?:(?:https?:\/\/)?(?:www\.)?github\.com(?=[/?#:]|$)|git@github\.com:)/i

/** Interpreta lo que escribe el usuario y lo normaliza a { owner, repo }. Devuelve null si no es válido. */
export function parseRepo(input: string): ParsedRepo | null {
  const text = input.trim()
  let segments: string[]

  if (LOOKS_LIKE_URL_RE.test(text)) {
    const prefix = text.match(GITHUB_PREFIX_RE)
    if (!prefix) return null
    // Se descartan ?query y #hash; del resto solo importan los dos primeros segmentos
    const path = text.slice(prefix[0].length).split(/[?#]/)[0].replace(/^[/:]/, '')
    segments = path.split('/')
    if (segments.length < 2) return null
  } else {
    segments = text.split('/')
    if (segments.length !== 2) return null
  }

  const owner = segments[0]
  let repo = segments[1]
  if (repo.endsWith('.git')) repo = repo.slice(0, -4)

  if (!OWNER_RE.test(owner)) return null
  if (!REPO_RE.test(repo) || repo === '.' || repo === '..') return null
  return { owner, repo }
}