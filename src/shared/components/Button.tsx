import type { ButtonHTMLAttributes } from 'react'

const variants = {
  primary: 'bg-accent text-bg hover:brightness-110',
  ghost: 'bg-accent-2/10 text-accent-2 hover:bg-accent-2/20',
  outline: 'border border-border text-text hover:bg-surface-2',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof variants }

export function Button({ variant = 'primary', className = '', ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-button px-4 py-2 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  )
}
