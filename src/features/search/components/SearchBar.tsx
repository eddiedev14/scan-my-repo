import { Button } from '@/shared/components/Button'
import { Field } from '@/shared/components/Field'
import { useSearchBar } from '@/features/search/hooks/useSearchBar'

interface Props {
  onSearch: (repo: string) => void // recibe "usuario/repo" ya normalizado
}

export function SearchBar({ onSearch }: Props) {
  const { value, setValue, error, submit } = useSearchBar(onSearch)
  return (
    <form onSubmit={submit} noValidate className="flex w-full flex-col gap-3 sm:flex-row sm:items-start">
      <div className="flex-1">
        <Field
          label="Repositorio de GitHub"
          hideLabel
          value={value}
          onChange={(e) => setValue(e.target.value)}
          error={error}
          placeholder="usuario/repo o https://github.com/usuario/repo"
          autoComplete="off"
          spellCheck={false}
          className="font-mono text-base sm:py-4 sm:text-lg"
        />
      </div>
      <Button type="submit" className="sm:py-4 sm:text-base sm:px-7">Escanear</Button>
    </form>
  )
}
