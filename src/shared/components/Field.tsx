import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string | null
}

export function Field({ label, hideLabel, hint, error, className = '', ...props }: Props) {
  const id = useId()
  const note = error ?? hint
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : 'text-sm text-muted'}>
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={note ? `${id}-note` : undefined}
        className={`w-full rounded-button border bg-surface px-4 py-3 text-text placeholder:text-muted/70 ${error ? 'border-danger' : 'border-border'} ${className}`}
        {...props}
      />
      {note && (
        <p id={`${id}-note`} role={error ? 'alert' : undefined} className={`text-sm ${error ? 'text-danger' : 'text-muted'}`}>
          {note}
        </p>
      )}
    </div>
  )
}
