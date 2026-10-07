'use client'

import { useEffect, useState } from 'react'
import type { SectionId } from '@/types/content'

/**
 * Scroll spy con IntersectionObserver.
 *
 * Deliberadamente NO escucha `scroll`: un listener de scroll en el hilo
 * principal es la forma más fácil de arruinar el INP de una página larga.
 * El observer dispara solo en los cruces de umbral.
 */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(ids[0] ?? null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // La sección activa es la visible más cercana al tope del viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        const first = visible[0]
        if (first) setActive(first.target.id as SectionId)
      },
      {
        // Banda de detección en el tercio superior: la sección se marca activa
        // cuando su encabezado entra, no cuando ya pasó de largo.
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    )

    for (const el of elements) observer.observe(el)
    return () => observer.disconnect()
  }, [ids])

  return active
}
