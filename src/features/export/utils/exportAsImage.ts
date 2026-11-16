import { toPng } from 'html-to-image'
import { sanitizeFileName } from '@/features/export/utils/sanitizeFileName'

// PNG gris de 1x1 px (color --color-muted): si un avatar no carga, se dibuja esto y la exportación sigue
const IMAGE_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAADElEQVR4nGPonrESAAN+Ac1Cy8qpAAAAAElFTkSuQmCC'

// Las tarjetas que aún no se vieron con el scroll están en opacity: 0 (.reveal) y las animaciones de entrada
// (.reveal, .grow-x/.grow-y, .score-arc) se copiarían a medias al clonar el nodo. Mientras se captura se fijan
// en su estado final
const FREEZE_ID = 'export-freeze-style'
const FREEZE_ATTR = 'data-exporting'
const FREEZE_CSS = `
[${FREEZE_ATTR}] .reveal { opacity: 1 !important; animation: none !important; transform: none !important; }
[${FREEZE_ATTR}] .grow-x, [${FREEZE_ATTR}] .grow-y, [${FREEZE_ATTR}] .score-arc { animation: none !important; transform: none !important; }
[${FREEZE_ATTR}] * { transition: none !important; }
`

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Recharts anima sus gráficas al montarse (JS, no CSS). Se espera a que el SVG deje de cambiar (máx. 3 s)
async function waitForCharts(node: HTMLElement) {
  const snapshot = () =>
    Array.from(node.querySelectorAll('.recharts-wrapper'))
      .map((el) => el.innerHTML)
      .join('')
  let prev = snapshot()
  const start = Date.now()
  while (Date.now() - start < 3000) {
    await sleep(120)
    const current = snapshot()
    if (current === prev) return
    prev = current
  }
}

// Lo que lleve data-export-ignore (p. ej. el enlace «Volver») no sale en la imagen
const filter = (el: Node) => !(el instanceof HTMLElement && el.hasAttribute('data-export-ignore'))

export async function exportAsImage(node: HTMLElement, fileName: string) {
  const style = document.createElement('style')
  style.id = FREEZE_ID
  style.textContent = FREEZE_CSS
  document.head.appendChild(style)
  node.setAttribute(FREEZE_ATTR, '')

  try {
    await document.fonts?.ready
    await waitForCharts(node)

    const options = {
      pixelRatio: 2,
      cacheBust: true,
      // Color real de la app, para que el PNG no salga transparente
      backgroundColor: getComputedStyle(document.body).backgroundColor,
      imagePlaceholder: IMAGE_PLACEHOLDER,
      // El margen del nodo (mt-8) se copiaría al clon y desplazaría el contenido, recortando el final de la imagen
      style: { margin: '0' },
      filter,
    }

    let dataUrl: string
    try {
      dataUrl = await toPng(node, options)
    } catch {
      // Último recurso si las fuentes de Google Fonts no se pueden incrustar: se exporta con las fuentes del sistema
      dataUrl = await toPng(node, { ...options, skipFonts: true })
    }

    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `${sanitizeFileName(fileName)}.png`
    link.click()
  } finally {
    node.removeAttribute(FREEZE_ATTR)
    style.remove()
  }
}
