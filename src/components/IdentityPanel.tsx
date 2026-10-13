import Image from 'next/image'
import { FileDown, Github, Linkedin } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { DataRow } from '@/components/primitives/DataRow'
import { profile } from '@/data/profile'

const AVAILABILITY = {
  available: { label: 'Available', tone: 'ok' },
  open: { label: 'Open to talk', tone: 'warn' },
  unavailable: { label: 'Unavailable', tone: 'muted' },
} as const

const FIELDS = [
  { label: 'role', value: profile.role },
  { label: 'specialization', value: profile.specialization },
  { label: 'location', value: profile.location },
] as const

/**
 * El CV sólo aparece si existe el archivo. Un botón "descargar CV" que da 404
 * es peor que no tenerlo: el visitante ya invirtió el click.
 */
const LINKS = [
  { id: 'github', icon: Github, label: 'GitHub', href: profile.github, primary: false },
  { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', href: profile.linkedin, primary: false },
  ...(profile.cvUrl
    ? [{ id: 'cv', icon: FileDown, label: 'CV', href: profile.cvUrl, primary: true }]
    : []),
] as const

/**
 * Tarjeta de identificación de sistema, NO un avatar.
 *
 * La foto va en un frame 4:5 en blanco y negro, con brackets de esquina que
 * citan el lenguaje de un visor, y una fila de verificación. El brief pedía
 * explícitamente que la foto se integre al diseño y no sea el círculo típico
 * de portfolio.
 */
export function IdentityPanel() {
  const availability = AVAILABILITY[profile.availability]

  return (
    <Panel
      label="identity"
      headerRight={
        <span className="flex items-center gap-2">
          <span className="label-mono text-ok">verified</span>
          <StatusDot tone="ok" label="Identidad verificada" />
        </span>
      }
    >
      <div className="p-4">
        <div className="relative overflow-hidden rounded-[4px] border border-line bg-canvas">
          <Image
            src={profile.photo}
            alt={`${profile.name}, ${profile.role}`}
            priority
            sizes="(max-width: 1024px) 100vw, 420px"
            className="aspect-4/5 w-full object-cover grayscale contrast-[1.08]"
          />

          {/* Brackets de esquina: 1px en accent, lenguaje de visor */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0">
            <span className="absolute left-2 top-2 size-4 border-l border-t border-accent/70" />
            <span className="absolute right-2 top-2 size-4 border-r border-t border-accent/70" />
            <span className="absolute bottom-2 left-2 size-4 border-b border-l border-accent/70" />
            <span className="absolute bottom-2 right-2 size-4 border-b border-r border-accent/70" />
          </span>

          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-canvas to-transparent px-3 pb-2 pt-8"
          >
            <span className="label-mono text-fg-muted">id: cm-001</span>
            <span className="label-mono text-fg-muted">profile node</span>
          </span>
        </div>

        <p className="mt-4 text-lg font-medium tracking-tight text-fg">{profile.name}</p>

        <dl className="mt-3 space-y-2">
          {FIELDS.map((field) => (
            <DataRow key={field.label} label={field.label}>
              {field.value}
            </DataRow>
          ))}

          <DataRow label="status">
            <StatusDot
              tone={availability.tone}
              pulse={profile.availability === 'available'}
              label={availability.label}
              visuallyHidden={false}
              labelClassName="font-mono text-[13px] text-fg"
            />
          </DataRow>
        </dl>

        {/* ---------------------------------------------------------------- */}
        {/* Accesos directos                                                 */}
        {/*                                                                  */}
        {/* La primera pantalla no tenía un solo link saliente: para llegar  */}
        {/* al GitHub había que scrollear cinco secciones o descubrir que la */}
        {/* terminal acepta comandos. Un reclutador no hace ninguna de las   */}
        {/* dos cosas.                                                       */}
        {/* ---------------------------------------------------------------- */}
        <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {LINKS.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5',
                    'font-mono text-[13px] transition-colors duration-150',
                    item.primary
                      ? 'border-accent-dim text-accent hover:border-accent hover:bg-accent/5'
                      : 'border-line text-fg-muted hover:border-line-hi hover:text-fg',
                  )}
                >
                  <Icon size={14} aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </Panel>
  )
}
