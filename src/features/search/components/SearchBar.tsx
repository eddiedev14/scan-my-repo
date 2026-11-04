import { Button } from '@/shared/components/Button'
import { Field } from '@/shared/components/Field'
import { useSearchBar } from '@/features/search/hooks/useSearchBar'

interface Props {
  onSearch: (repo: string) => void // recibe "usuario/repo" ya normalizado
  disabled?: boolean
}

export function SearchBar({ onSearch, disabled = false }: Props) {
  const { value, setValue, error, submit } = useSearchBar(onSearch, disabled)
  return (
    <form onSubmit={submit} noValidate className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Field
          label="Repositorio de GitHub"
          hideLabel
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
          disabled={disabled}
          placeholder="usuario/repo o https://github.com/usuario/repo"
          autoComplete="off"
          spellCheck={false}
          className="font-mono text-base sm:py-4 sm:text-lg"
        />
      </div>
      <Button type="submit" disabled={disabled} className="sm:py-4 sm:text-base sm:px-7">
        Escanear
      </Button>
    </form>
  )
}