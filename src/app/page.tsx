import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Panel } from '@/components/primitives/Panel'
import { Reveal } from '@/components/primitives/Reveal'
import { StatusDot } from '@/components/primitives/StatusDot'
import { sections } from '@/data/sections'
import { profile } from '@/data/profile'

/**
 * FASE 0 — esqueleto.
 *
 * Las 7 secciones existen con su ancla y su header definitivo para que el
 * scroll spy, el rail y la barra de progreso sean verificables desde ya.
 * Cada fase siguiente reemplaza un placeholder por su componente real.
 */
const PHASE_BY_SECTION: Record<string, string> = {
  identity: 'Fase 1 — terminal + identity panel',
  projects: 'Fase 2 — módulos de proyecto',
  stack: 'Fase 3 — system modules',
  architecture: 'Fase 4 — diagrama de capas',
  ai: 'Fase 5 — agente local',
  timeline: 'Fase 6 — log de experiencia',
  contact: 'Fase 6 — POST /contact',
}

export default function HomePage() {
  return (
    <>
      {sections.map((section) => (
        <Section key={section.id} id={section.id}>
          <SectionHeader
            endpoint={section.endpoint}
            title={section.title}
            description={section.id === 'identity' ? profile.summary : undefined}
          />

          <Reveal>
            <Panel label="pending" headerRight={<StatusDot tone="warn" label="pendiente" />}>
              <p className="px-4 py-6 font-mono text-sm text-fg-muted">
                {PHASE_BY_SECTION[section.id]}
              </p>
            </Panel>
          </Reveal>
        </Section>
      ))}
    </>
  )
}
