import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DataRowProps {
  /** Label técnico, se renderiza en mono uppercase. */
  label: string
  /** El valor: texto, un StatusDot, un link. */
  children: ReactNode
  className?: string
}

/**
 * Fila label → guía punteada → valor.
 *
 * Es el patrón de lectura de datos del sitio y aparece en el identity panel,
 * en los módulos de proyecto, en el stack y en la terminal. Vive acá para que
 * no derive en cuatro variantes levemente distintas.
 *
 * Va dentro de un `<dl>`.
 */
export function DataRow({ label, children, className }: DataRowProps) {
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <dt className="label-mono shrink-0 text-fg-faint">{label}</dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dashed border-line"
      />
      <dd className="shrink-0 text-right font-mono text-[13px] text-fg">{children}</dd>
    </div>
  )
}
