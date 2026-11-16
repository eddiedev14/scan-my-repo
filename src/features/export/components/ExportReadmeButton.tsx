import { downloadReadme } from '@/features/export/utils/downloadReadme'
import { Button } from '@/shared/components/Button'

interface Props {
  readme: string | null
  fileName: string
  disabled?: boolean
}

// Descarga el README del repositorio analizado, idéntico al original
export function ExportReadmeButton({ readme, fileName, disabled = false }: Props) {
  const hasReadme = Boolean(readme)

  return (
    <Button
      variant="ghost"
      onClick={() => readme && downloadReadme(readme, fileName)}
      disabled={disabled || !hasReadme}
      title={hasReadme ? undefined : 'Este repositorio no tiene README'}
    >
      Exportar README
    </Button>
  )
}
