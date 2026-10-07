import Image from 'next/image'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
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
            <div key={field.label} className="flex items-baseline gap-2">
              <dt className="label-mono shrink-0 text-fg-faint">{field.label}</dt>
              <span
                aria-hidden="true"
                className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dashed border-line"
              />
              <dd className="shrink-0 font-mono text-[13px] text-fg">{field.value}</dd>
            </div>
          ))}

          <div className="flex items-baseline gap-2">
            <dt className="label-mono shrink-0 text-fg-faint">status</dt>
            <span
              aria-hidden="true"
              className="min-w-4 flex-1 translate-y-[-0.2em] border-b border-dashed border-line"
            />
            <dd className="shrink-0">
              <StatusDot
                tone={availability.tone}
                pulse={profile.availability === 'available'}
                label={availability.label}
                visuallyHidden={false}
                labelClassName="font-mono text-[13px] text-fg"
              />
            </dd>
          </div>
        </dl>
      </div>
    </Panel>
  )
}
