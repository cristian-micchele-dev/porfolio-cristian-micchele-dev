import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { ResponseBlock } from '@/components/primitives/ResponseBlock'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import { architectureLayers, architectureStatement } from '@/data/architecture'

/**
 * SYSTEM ARCHITECTURE.
 *
 * La sección donde el posicionamiento se vuelve concreto: no alcanza con
 * nombrar "arquitectura limpia", hay que mostrar qué vive en cada capa y qué
 * decisión implica.
 */
export function Architecture() {
  return (
    <Section id="architecture">
      <SectionHeader
        endpoint="GET /architecture"
        title="System Architecture"
        description={architectureStatement}
      />

      <ResponseBlock
        method="GET"
        path="/api/architecture"
        status={200}
        statusText="OK"
        // El endpoint devuelve además los conceptos; el bloque resume lo que
        // esta sección renderiza.
        body={{
          layers: architectureLayers.length,
          style: 'hexagonal',
          dependency_direction: 'inward',
        }}
      />

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-12">
        {/* ---------------------------------------------------------------- */}
        {/* Diagrama                                                         */}
        {/* ---------------------------------------------------------------- */}
        <Reveal className="lg:col-span-7">
          <Panel label="layers">
            <div className="p-4">
              <ArchitectureDiagram />
            </div>
          </Panel>
        </Reveal>

        {/* ---------------------------------------------------------------- */}
        {/* Qué vive en cada capa                                            */}
        {/* ---------------------------------------------------------------- */}
        <Reveal delay={0.08} className="lg:col-span-5">
          <Panel label="responsibilities">
            <ol className="divide-y divide-line">
              {architectureLayers.map((layer, index) => (
                <li key={layer.id} className="flex gap-3 px-4 py-3">
                  <span className="label-mono shrink-0 tabular-nums text-fg-faint">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[13px] text-fg">{layer.name}</p>
                    <p className="mt-1 text-[15px] leading-relaxed text-fg-muted">
                      {layer.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
