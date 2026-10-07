import { ArrowUpRight } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { ResponseBlock } from '@/components/primitives/ResponseBlock'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { DataRow } from '@/components/primitives/DataRow'
import { StatusDot } from '@/components/primitives/StatusDot'
import { moduleGroups } from '@/data/stack'
import { certificates } from '@/data/certificates'
import { sortCertificatesByYear } from '@/lib/certificates'
import { MODULE_STATUS_META, countModules } from '@/lib/stack'

const counts = countModules(moduleGroups)
const verified = sortCertificatesByYear(certificates)

/**
 * SYSTEM MODULES.
 *
 * Sin barras de porcentaje: "Node.js 90%" no significa nada y el brief las
 * prohíbe. Cada módulo declara un estado real — `active` es lo que uso en
 * producción, `learning` lo que estoy incorporando.
 *
 * Los certificados van embebidos acá como `verified`, no en sección propia:
 * son refuerzo del stack, no contenido principal.
 */
export function Stack() {
  return (
    <Section id="stack">
      <SectionHeader
        endpoint="GET /modules"
        title="System Modules"
        description="Las tecnologías que uso, con su estado real. Sin porcentajes inventados."
      />

      <ResponseBlock
        method="GET"
        path="/api/modules"
        status={200}
        statusText="OK"
        body={{
          groups: counts.groups,
          modules: counts.modules,
          active: counts.active,
          learning: counts.learning,
        }}
      />

      <div className="mt-6 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {moduleGroups.map((group, index) => (
          <Reveal key={group.id} delay={Math.min(index, 4) * 0.06}>
            <Panel
              label={group.label}
              headerRight={
                <span className="label-mono tabular-nums text-fg-faint">
                  {group.modules.length}
                </span>
              }
            >
              <dl className="space-y-2 p-4">
                {group.modules.map((tech) => {
                  const meta = MODULE_STATUS_META[tech.status]
                  return (
                    <DataRow key={tech.name} label={tech.name}>
                      <StatusDot
                        tone={meta.tone}
                        label={meta.label}
                        visuallyHidden={false}
                        labelClassName="font-mono text-[13px] text-fg-muted"
                      />
                    </DataRow>
                  )
                })}
              </dl>
            </Panel>
          </Reveal>
        ))}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Certificados como módulos verificados                              */}
      {/* ------------------------------------------------------------------ */}
      <Reveal delay={0.1} className="mt-5">
        <Panel
          label="verified"
          headerRight={
            <span className="label-mono tabular-nums text-fg-faint">{verified.length}</span>
          }
        >
          <ul className="divide-y divide-line">
            {verified.map((certificate) => (
              <li key={certificate.id}>
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-surface-hi"
                >
                  <span className="font-mono text-[11px] tabular-nums text-fg-faint">
                    {certificate.year}
                  </span>
                  <span className="text-[15px] text-fg">{certificate.title}</span>
                  <span className="label-mono text-fg-muted">{certificate.issuer}</span>
                  <ArrowUpRight
                    size={14}
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-fg-faint transition-colors group-hover:text-accent"
                  />
                </a>
              </li>
            ))}
          </ul>
        </Panel>
      </Reveal>
    </Section>
  )
}
