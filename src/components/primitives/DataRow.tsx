import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DataRowProps {
  /** Label técnico, se renderiza en mono uppercase. */
  label: string
  /** El valor: texto, un StatusDot, un link. */
  children: ReactNode
  /**
   * Apila label sobre valor, sin guía punteada.
   *
   * Para valores largos. La guía punteada sólo funciona cuando el valor
   * entra en una línea corta; con una frase, o desborda o se parte y la guía
   * queda colgando de la nada.
   */
  stacked?: boolean
  className?: string
}

/**
 * Fila label → guía punteada → valor.
 *
 * Es el patrón de lectura de datos del sitio y aparece en el identity panel,
 * en los módulos de proyecto, en el stack y en el caso destacado. Vive acá
 * para que no derive en cuatro variantes levemente distintas.
 *
 * Va dentro de un `<dl>`.
 */
export function DataRow({ label, children, stacked = false, className }: DataRowProps) {
  if (stacked) {
    return (
      <div className={cn('min-w-0', className)}>
        <dt className="label-mono text-fg-faint">{label}</dt>
        <dd className="mt-1 font-mono text-[13px] leading-relaxed text-fg">{children}</dd>
      </div>
    )
  }

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <dt className="label-mono shrink-0 text-fg-faint">{label}</dt>
      <span
        aria-hidden="true"
        className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dashed border-line"
      />
      {/* `min-w-0` y no `shrink-0`: con shrink-0 un valor largo no se encoge y
          se desborda por encima de lo que tenga al lado. */}
      <dd className="min-w-0 text-right font-mono text-[13px] text-fg">{children}</dd>
    </div>
  )
}
