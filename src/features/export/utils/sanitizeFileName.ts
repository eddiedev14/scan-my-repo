// deja solo letras, números, - _ y . (lo demás pasa a -) y colapsa guiones repetidos, no cambia mayúsculas
// por ejemplo  "mi repo!-reporte" -> "mi-repo-reporte"
export function sanitizeFileName(name: string): string {
  return name.replace(/[^\p{L}\p{N}\-_.]/gu, '-').replace(/-{2,}/g, '-')
}
