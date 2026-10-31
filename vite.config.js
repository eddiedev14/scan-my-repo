import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  // Expone GROQ_API_KEY y GROQ_MODEL (nombres de .env.example) al cliente además de VITE_*
  envPrefix: ['VITE_', 'GROQ_'],
})
