import { useState } from 'react'
import { exportAsImage } from '@/features/export/utils/exportAsImage'
import { Button } from '@/shared/components/Button'
import { Spinner } from '@/shared/components/Spinner'

interface Props {
  targetId: string
  fileName: string
  disabled?: boolean
}

const ERROR_MESSAGE = 'No se pudo generar la imagen. Intenta de nuevo.'

function ImageIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// Descarga como PNG todo lo que hay dentro del elemento con id={targetId}
export function ExportReportButton({ targetId, fileName, disabled = false }: Props) {
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(false)

  const handleClick = async () => {
    if (disabled || exporting) return
    setError(false)
    setExporting(true)
    try {
      const node = document.getElementById(targetId)
      if (!node) throw new Error(`No existe el elemento #${targetId}`)
      await exportAsImage(node, fileName)
    } catch {
      setError(true)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="outline" onClick={handleClick} disabled={disabled || exporting}>
        {exporting ? (
          <>
            <Spinner className="size-4" />
            Generando imagen…
          </>
        ) : (
          <>
            <ImageIcon />
            Exportar reporte
          </>
        )}
      </Button>
      {error && (
        <p role="alert" className="text-sm text-danger">
          {ERROR_MESSAGE}
        </p>
      )}
    </div>
  )
}
