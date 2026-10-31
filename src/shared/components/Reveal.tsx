import type { CSSProperties, HTMLAttributes } from 'react'
import { useInView } from '@/shared/hooks/useInView'

type Props = HTMLAttributes<HTMLDivElement> & { delay?: number } // delay en ms

// Envuelve cualquier bloque para que aparezca suavemente al llegar a él con el scroll
export function Reveal({ delay = 0, className = '', style, ...props }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${inView ? 'is-visible' : ''} ${className}`}
      style={{ '--reveal-delay': `${delay}ms`, ...style } as CSSProperties}
      {...props}
    />
  )
}
