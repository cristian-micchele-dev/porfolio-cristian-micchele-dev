'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { navSections, sections } from '@/data/sections'
import { useActiveSectionContext } from './ActiveSectionProvider'
import { cn } from '@/lib/cn'

/**
 * Navegación de secciones para viewports chicos.
 *
 * Abajo de 768px la nav de la status bar está oculta y el rail aparece recién
 * en 1280px: hasta ahora, pasado el hero no había forma de saltar de sección.
 * La barra de progreso indica avance pero no es accionable.
 *
 * El botón muestra la sección ACTIVA, así que resuelve dos cosas con un solo
 * control: decir dónde estás —que en mobile tampoco se sabía— y dejar saltar
 * a otra. El lenguaje es el mismo de los chips de la terminal, no un
 * hamburger genérico.
 */
export function MobileNav() {
  const active = useActiveSectionContext()
  const [open, setOpen] = useState(false)
  const menuId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const current = sections.find((s) => s.id === active)

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      // Devolver el foco al disparador: si el menú se cierra y el foco queda
      // en el body, quien navega con teclado vuelve al principio del tab.
      buttonRef.current?.focus()
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <div ref={containerRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={`Secciones. Actual: ${current?.title ?? 'inicio'}`}
        className={cn(
          'flex items-center gap-1.5 rounded-[4px] border px-2 py-1 font-mono text-[13px] transition-colors',
          open
            ? 'border-line-hi bg-surface-hi text-fg'
            : 'border-line bg-surface text-fg-muted',
        )}
      >
        <span aria-hidden="true">/{current?.navLabel ?? 'identity'}</span>
        <ChevronDown
          size={14}
          aria-hidden="true"
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <nav
        id={menuId}
        aria-label="Secciones"
        hidden={!open}
        className="absolute inset-x-0 top-12 border-b border-line bg-canvas/95 backdrop-blur-md"
      >
        <ul className="mx-auto max-w-[1200px] px-4 py-2 sm:px-6">
          {navSections.map((section) => {
            const isActive = active === section.id
            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'flex items-baseline gap-3 rounded-[4px] px-2 py-2.5 font-mono text-sm transition-colors',
                    isActive ? 'text-accent' : 'text-fg-muted',
                  )}
                >
                  <span className="w-20 shrink-0">/{section.navLabel}</span>
                  <span className="label-mono truncate text-fg-faint">{section.endpoint}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
