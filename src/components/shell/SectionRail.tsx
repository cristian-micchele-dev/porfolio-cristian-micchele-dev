'use client'

import { sections } from '@/data/sections'
import { useActiveSectionContext } from './ActiveSectionProvider'
import { cn } from '@/lib/cn'

/**
 * Índice vertical estilo gutter de números de línea. DESIGN.md §5.
 *
 * Solo ≥1280px: en viewports menores compite con el contenido y el espacio
 * vale más que el detalle. En mobile su función la cumple la barra de progreso
 * de la StatusBar.
 */
export function SectionRail() {
  const active = useActiveSectionContext()

  return (
    <nav
      aria-label="Índice de secciones"
      className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block"
    >
      <ul className="flex flex-col gap-1">
        {sections.map((section, index) => {
          const isActive = active === section.id
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className="group flex items-center gap-3 py-1"
              >
                <span
                  className={cn(
                    'label-mono tabular-nums transition-colors',
                    isActive ? 'text-accent' : 'text-fg-faint group-hover:text-fg-muted',
                  )}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span
                  className={cn(
                    'h-px transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    isActive ? 'w-6 bg-accent' : 'w-3 bg-line group-hover:w-4 group-hover:bg-line-hi',
                  )}
                  aria-hidden="true"
                />
                <span className="sr-only">{section.title}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
