import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { timeline } from '@/data/timeline'
import { formatMonthYear } from '@/lib/format'

/**
 * GET /timeline.
 *
 * Experiencia como log cronológico, no como cards: la sección Projects ya usa
 * cards y repetir el patrón acá lo volvería monótono. El gutter de fecha más
 * la línea con nodos se lee como un historial de commits, que es el registro
 * que el resto del sitio viene sosteniendo.
 */
export function Timeline() {
  return (
    <Section id="timeline">
      <SectionHeader
        endpoint="GET /timeline"
        title="Timeline"
        description="Proyectos con clientes reales, en orden cronológico inverso."
      />

      <Reveal>
        <Panel
          label="log"
          headerRight={
            <span className="label-mono tabular-nums text-fg-faint">{timeline.length}</span>
          }
        >
          <ol className="divide-y divide-line">
            {timeline.map((entry) => (
              <li key={entry.id} className="flex gap-4 p-4 sm:gap-6">
                {/* Gutter de fecha + nodo, como un log de commits */}
                <div className="flex shrink-0 flex-col items-center gap-2 pt-1">
                  <span className="label-mono whitespace-nowrap tabular-nums text-fg-muted">
                    {formatMonthYear(entry.date)}
                  </span>
                  <span className="size-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                  <span className="w-px flex-1 bg-line" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="label-mono text-fg-faint">{entry.org}</p>
                  <h3 className="mt-1 text-lg font-medium tracking-tight text-fg">
                    {entry.title}
                  </h3>
                  <p className="mt-1 font-mono text-[13px] text-accent">{entry.role}</p>
                  <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-fg-muted">
                    {entry.description}
                  </p>

                  {entry.url && (
                    <a
                      href={entry.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] text-accent underline decoration-accent-dim underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      ver sitio
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>

                {entry.image && (
                  <div className="hidden w-[220px] shrink-0 overflow-hidden rounded-[4px] border border-line md:block">
                    <Image
                      src={entry.image}
                      alt={`Captura de ${entry.org}`}
                      sizes="220px"
                      className="aspect-16/10 w-full object-cover object-top"
                    />
                  </div>
                )}
              </li>
            ))}
          </ol>
        </Panel>
      </Reveal>
    </Section>
  )
}
