import { ArrowUpRight, Github, Linkedin, Mail } from 'lucide-react'
import { Section } from '@/components/primitives/Section'
import { SectionHeader } from '@/components/primitives/SectionHeader'
import { Reveal } from '@/components/primitives/Reveal'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { ContactTerminal } from '@/components/ContactTerminal'
import { profile } from '@/data/profile'
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

        </Reveal>
      </div>
    </Section>
  )
}
