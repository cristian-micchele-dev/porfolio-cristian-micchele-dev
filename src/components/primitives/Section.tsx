import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import type { SectionId } from '@/types/content'

interface SectionProps {
  id: SectionId
  children: ReactNode
  className?: string
}

/**
 * Contenedor de sección: ancla del scroll spy + canvas de 12 columnas.
 * `scroll-mt` compensa la status bar fija. DESIGN.md §5.
 */
export function Section({ id, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'mx-auto w-full max-w-[1200px] scroll-mt-20 px-4 py-16 sm:px-6 md:py-24',
        className,
      )}
    >
      {children}
    </section>
  )
}
