import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: {
    proxy: { '/api': 'http://localhost:8787' },
    // wrangler dev escribe en .wrangler en cada petición; sin esto Vite recarga la página en bucle
    watch: { ignored: ['**/.wrangler/**', '**/.dev.vars'] },
  },
})
