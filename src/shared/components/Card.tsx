import type { CSSProperties, HTMLAttributes } from 'react'
import { useInView } from '@/shared/hooks/useInView'

type Props = HTMLAttributes<HTMLDivElement> & { delay?: number } // delay de aparición en ms

// Borde fino, sin sombra. Aparece con el scroll; el hover invertido es opt-in con la clase card-invert (index.css)
export function Card({ delay = 0, className = '', style, ...props }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} rounded-card border border-border bg-surface p-6 transition duration-200 hover:border-muted/50 ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
      {...props}
    />
  )
}
