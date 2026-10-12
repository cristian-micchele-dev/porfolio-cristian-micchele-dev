'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useActiveSection } from '@/hooks/useActiveSection'
import { SECTION_IDS, type SectionId } from '@/types/content'

const ActiveSectionContext = createContext<SectionId | null>(null)

/**
 * Un solo IntersectionObserver para toda la app.
 *
 * La StatusBar, el SectionRail y el LogFooter necesitan la sección activa.
 * Si cada uno llamara a `useActiveSection`, habría tres observers vigilando
 * las mismas secciones — y la única forma de que coincidan siempre es
 * que la fuente sea una.
 */
export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const active = useActiveSection(SECTION_IDS)
  return <ActiveSectionContext.Provider value={active}>{children}</ActiveSectionContext.Provider>
}

export function useActiveSectionContext(): SectionId | null {
  return useContext(ActiveSectionContext)
}
