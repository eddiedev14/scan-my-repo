import { mockAiResult } from '../mocks/aiResult.mock'
import { mockReport, mockReportEmpty } from '../mocks/report.mock'
import { HistoryEntry } from '../types'

const EXAMPLES = ['eddiedev14/linknest']

const FEATURES = [
  { title: 'Lenguajes', text: 'Qué tecnologías usa el proyecto y en qué proporción, de un vistazo.' },
  { title: 'Actividad de commits', text: 'Cuántos commits hubo cada semana, incluidas las semanas en silencio.' },
  {
    title: 'Contribuidores e issues',
    text: 'Quién mueve el repo y cuántos issues siguen abiertos frente a los cerrados.',
  },
  {
    title: 'Resumen con IA y calificación',
    text: 'Un resumen corto, una nota de 1 a 5 y mejoras concretas para subirla.',
  },
]

// Datos de ejemplo hasta que el historial sea real
const SAMPLE_HISTORY: HistoryEntry[] = [
  { id: crypto.randomUUID(), repo: mockReport.repo, date: '2026-10-28', data: mockReport, ia: mockAiResult },
  { id: crypto.randomUUID(), repo: mockReportEmpty.repo, date: '2026-10-30', data: mockReportEmpty, ia: null },
]

export { EXAMPLES, FEATURES, SAMPLE_HISTORY }
