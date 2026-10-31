import axios from 'axios'

export const groqApi = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: { Authorization: `Bearer ${import.meta.env.GROQ_API_KEY ?? ''}` },
})
