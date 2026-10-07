import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Panel } from '@/components/primitives/Panel'
import { Reveal } from '@/components/primitives/Reveal'
import { StatusDot } from '@/components/primitives/StatusDot'
import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { sections } from '@/data/sections'

/**
 * Las secciones ya construidas se renderizan con su componente; el resto
 * mantiene su ancla y su header definitivo con un placeholder, para que el
 * scroll spy, el rail y la barra de progreso sigan siendo verificables.
 */
const PENDING_PHASE: Record<string, string> = {
  stack: 'Fase 3 — system modules',
  architecture: 'Fase 4 — diagrama de capas',
  ai: 'Fase 5 — agente local',
  timeline: 'Fase 6 — log de experiencia',
  contact: 'Fase 6 — POST /contact',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />

      {sections
        .filter((section) => section.id in PENDING_PHASE)
        .map((section) => (
          <Section key={section.id} id={section.id}>
            <SectionHeader endpoint={section.endpoint} title={section.title} />

            <Reveal>
              <Panel label="pending" headerRight={<StatusDot tone="warn" label="pendiente" />}>
                <p className="px-4 py-6 font-mono text-sm text-fg-muted">
                  {PENDING_PHASE[section.id]}
                </p>
              </Panel>
            </Reveal>
          </Section>
        ))}
    </>
  )
}
