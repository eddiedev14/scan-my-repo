import { AiResult, Report } from '@/shared/types'
import { summarizeApi } from '../api/summarize'
import { buildSummaryPayload } from '../utils/buildSummaryPayload'

// Lo que responde el Worker
interface SummarizeResponse {
  resumen: string
  calificacion: number
  fortalezas: string[]
  mejoras: string[]
}

export const getAiSummary = async (report: Report): Promise<AiResult> => {
  const { data } = await summarizeApi.post<SummarizeResponse>('/api/summarize', buildSummaryPayload(report))
  return {
    summary: data.resumen,
    score: data.calificacion,
    strengths: data.fortalezas,
    improvements: data.mejoras,
  }
}
