import { SYSTEM_PROMPT } from './prompt.js'
import { cleanResult, parseModelJSON, validatePayload } from './validate.js'

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MAX_BODY = 20000 // Logitud máxima del body
const TIMEOUT_MS = 25000 // 25 segundos de espera a Groq

const json = (status, body, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } })
const fail = (status, error, headers) => json(status, { error }, headers)

// Función serverless
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== '/api/summarize') return fail(404, 'Ruta no encontrada')
    if (request.method !== 'POST') return fail(405, 'Metodo no permitido.', { Allow: 'POST' })

    //* 1. Leer y validar lo que manda el navegador
    const raw = await request.text()
    if (raw.length > MAX_BODY) return fail(413, 'La solicitud es demasiado grande')

    let body
    try {
      body = JSON.parse(raw)
    } catch (error) {
      return fail(400, 'El cuerpo de la solicitud no es un JSON válido')
    }

    const { data, invalid } = validatePayload(body)
    if (invalid.length) return fail(400, `Faltan o son inválidos estos campos: ${invalid.join(', ')}`)

    if (!env.GROQ_API_KEY) {
      console.error('Falta GROQ_API_KEY en .dev.vars (local) o en los secrets (producción)')
      return fail(500, 'El servicio de IA no está configurado')
    }

    //* 2. Llamar a Groq
    const userMessage =
      'Analiza este repositorio de GitHub y responde solo con el JSON indicado.\n\nDATOS (JSON):\n' +
      JSON.stringify({ ...data, fechaActual: new Date().toISOString().slice(0, 10) })

    const controller = new AbortController()
    const timer = setTimeout(() => {
      controller.abort()
    }, TIMEOUT_MS)
    let status, payload

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        signal: controller.signal,
        headers: { Authorization: `Bearer ${env.GROQ_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: env.GROQ_MODEL || 'openai/gpt-oss-120b',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.2,
          reasoning_effort: 'low',
          max_completion_tokens: 2000,
          response_format: { type: 'json_object' },
        }),
      })

      status = res.status
      payload = await res.json().catch(() => null)
    } catch (error) {
      console.error('Falló la llamada a Groq:', error.name)
      return error.name === 'AbortError'
        ? fail(504, 'La IA tardó demasiado en responder')
        : fail(502, 'El servicio de IA no está disponible por ahora')
    } finally {
      clearTimeout(timer)
    }

    if (status === 401 || status === 403) {
      console.error('Groq rechazó la clave:', status)
      return fail(502, 'No se pudo autenticar con el servicio de IA.')
    }

    if (status === 429) return fail(429, 'El servicio de IA está saturado. Intenta de nuevo en unos minutos.')

    if (status < 200 || status >= 300) {
      console.error('Groq respondió', status, payload?.error?.message)
      return fail(502, 'El servicio de IA no está disponible por ahora.')
    }

    // * 3. Leer y limpiar la respuesta del modelo
    const parsed = parseModelJSON(payload?.choices?.[0]?.message?.content)
    if (!parsed) return fail(502, 'La IA devolvió una respuesta que no se pudo leer')
    const result = cleanResult(parsed)
    if (!result) return fail(502, 'La IA devolvió una respuesta incompleta')

    return json(200, result)
  },
}
