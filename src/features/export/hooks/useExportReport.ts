import { useRef } from 'react'

// Stub. TODO: exportPng con html-to-image sobre ref.current y descarga del archivo.
export function useExportReport() {
  const ref = useRef<HTMLDivElement>(null)
  return { ref, exporting: false, exportPng: async () => {} }
}
