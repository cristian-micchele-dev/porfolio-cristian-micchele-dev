import { ArrowUpRight, FileDown, Github, Linkedin, Mail } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { ContactTerminal } from '@/components/ContactTerminal'
import { CurlInvite } from '@/components/CurlInvite'
import { DataRow } from '@/components/primitives/DataRow'
import { profile } from '@/data/profile'
import { knowledgeBase } from '@/data/knowledge'
import { stripProtocol } from '@/lib/format'

const CHANNELS = [
  { id: 'email', icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: stripProtocol(profile.linkedin),
    href: profile.linkedin,
  },
  { id: 'github', icon: Github, label: stripProtocol(profile.github), href: profile.github },
] as const

/**
 * POST /contact.
 *
 * Además del formulario se exponen los canales directos: un formulario es
 * cómodo pero nadie debería quedar obligado a confiar en él para escribir.
 */
export function Contact() {
  return (
    <Section id="contact">
      <SectionHeader
        endpoint="POST /contact"
        title="Contact"
        description="Abierto a posiciones backend o full stack, y a proyectos freelance."
      />

      <div className="grid items-start gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <ContactTerminal />
        </Reveal>

        <Reveal delay={0.08} className="space-y-5 lg:col-span-5">
          <Panel
            label="direct channels"
            headerRight={
              <StatusDot
                tone={profile.availability === 'available' ? 'ok' : 'muted'}
                label={profile.availability === 'available' ? 'available' : 'unavailable'}
                visuallyHidden={false}
                labelClassName="label-mono text-fg-muted"
              />
            }
          >
            <ul className="divide-y divide-line">
              {CHANNELS.map((channel) => {
                const Icon = channel.icon
                return (
                  <li key={channel.id}>
                    <a
                      href={channel.href}
                      target={channel.href.startsWith('mailto:') ? undefined : '_blank'}
                      rel="noreferrer"
                      className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-hi"
                    >
                      <Icon size={16} aria-hidden="true" className="shrink-0 text-fg-faint" />
                      <span className="min-w-0 truncate font-mono text-[13px] text-fg">
                        {channel.label}
                      </span>
                      <ArrowUpRight
                        size={14}
                        aria-hidden="true"
                        className="ml-auto shrink-0 text-fg-faint transition-colors group-hover:text-accent"
                      />
                    </a>
                  </li>
                )
              })}
            </ul>
          </Panel>

          {/* El CV sólo existe si existe el archivo. Ver src/data/profile.ts */}
          {profile.cvUrl && (
            <Panel label="curriculum">
              <div className="p-4">
                <p className="text-[15px] leading-relaxed text-fg-muted">
                  El CV completo, con la experiencia y la formación en detalle.
                </p>
                <a
                  href={profile.cvUrl}
                  download
                  className="mt-3 inline-flex items-center gap-2 rounded-[4px] border border-accent-dim px-3 py-2 label-mono text-accent transition-colors hover:border-accent hover:bg-accent/5"
                >
                  <FileDown size={14} aria-hidden="true" />
                  descargar cv
                </a>
              </div>
            </Panel>
          )}

          <CurlInvite />

          {/* ---------------------------------------------------------------- */}
          {/* Cómo está hecha la consola                                       */}
          {/*                                                                  */}
          {/* Sobrevive de la sección AI, que se fusionó con el hero. Quedan   */}
          {/* los datos y no la prosa que explicaba el diseño: una fila que    */}
          {/* dice "adapter: LocalAgent" describe lo que hay en el repo y se   */}
          {/* puede verificar; un párrafo explicando por qué se eligió un      */}
          {/* puerto es una afirmación de criterio, y esa hay que poder        */}
          {/* defenderla.                                                      */}
          {/* ---------------------------------------------------------------- */}
          <Panel label="console">
            <dl className="space-y-2 p-4">
              <DataRow label="port">AgentPort</DataRow>
              <DataRow label="adapter">LocalAgent</DataRow>
              <DataRow label="endpoint">POST /api/ask</DataRow>
              <DataRow label="rate limit">20 req/min</DataRow>
              <DataRow label="entries">{String(knowledgeBase.length)}</DataRow>
            </dl>
          </Panel>
        </Reveal>
      </div>
    </Section>
  )
}
