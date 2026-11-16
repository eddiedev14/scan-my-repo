import { sanitizeFileName } from '@/features/export/utils/sanitizeFileName'

// Descarga el texto tal cual (UTF-8, sin tocar tildes ni saltos de línea) como {fileName}.md
export function downloadReadme(text: string, fileName: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFileName(fileName)}.md`
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Se libera después del clic: algunos navegadores cancelan la descarga si se revoca en el mismo instante
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
