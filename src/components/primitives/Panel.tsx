import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PanelProps {
  /** Label mono uppercase del header. Sin label, el panel va sin header. */
  label?: string
  /** Contenido alineado a la derecha del header (status, contador, acción). */
  headerRight?: ReactNode
  children: ReactNode
  className?: string
  /** Resalta el borde en hover. Solo para paneles que son link o botón. */
  interactive?: boolean
  as?: 'div' | 'article' | 'section' | 'aside'
}

/**
 * El átomo de diseño del sitio. DESIGN.md §5.
 *
 * Se apoya en el plano: sin sombra, sin blur, sin gradiente.
 * Borde de 1px y radio de 6px, siempre. Todas las secciones se componen de esto.
 */
export function Panel({
  label,
  headerRight,
  children,
  className,
  interactive = false,
  as: Tag = 'div',
}: PanelProps) {
  return (
    <Tag
      className={cn(
        'rounded-panel border border-line bg-surface',
        interactive && 'transition-colors duration-150 hover:border-line-hi',
        className,
      )}
    >
      {label && (
        <header className="flex items-center justify-between gap-3 border-b border-line bg-surface-hi px-4 py-2.5">
          <span className="label-mono text-fg-muted">{label}</span>
          {headerRight}
        </header>
      )}
      {children}
    </Tag>
  )
}
