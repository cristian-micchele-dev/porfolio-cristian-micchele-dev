import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { clientWork } from '@/data/clients'
import { formatMonthYear } from '@/lib/format'

/**
 * Experiencia laboral: trabajo pago con clientes reales.
 *
 * La etiqueta dice "experiencia laboral" y no "freelance · clientes" porque
 * es lo que un reclutador busca —y lo que usa el propio CV—. Cada entrada
 * aclara que fue freelance, asi el encabezado habla su idioma sin que el
 * conjunto se lea como empleo en relacion de dependencia.
 *
 * Deliberadamente NO usa la forma de `ProjectModule`: una optimización SEO no
 * tiene stack, ni arquitectura, ni deployment, y forzarla a esos campos
 * produciría una card medio vacía al lado de Pulso.
 *
 * Pero sí lleva captura y descripción: son trabajos reales para clientes que
 * pagaron, y una línea suelta no alcanza para que se entienda qué se hizo.
 * El formato es de registro —fecha en el gutter, contenido, captura— y no de
 * card, así no compite con la grilla de arriba.
 */
export function ClientWorkPanel() {
  return (
    <Panel
      label="experiencia laboral"
      headerRight={
        <span className="label-mono tabular-nums text-fg-faint">{clientWork.length}</span>
      }
    >
      <ul className="divide-y divide-line">
        {clientWork.map((client) => (
          <li key={client.id} className="flex flex-col gap-4 p-5 md:flex-row md:gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="label-mono whitespace-nowrap tabular-nums text-fg-faint">
                  {formatMonthYear(client.date)}
                </span>
                <span className="label-mono text-fg-muted">{client.org}</span>
              </div>

              <h3 className="mt-2 text-lg font-medium tracking-tight text-fg">{client.title}</h3>
              <p className="mt-1 font-mono text-[13px] text-accent">{client.role}</p>

              <p className="mt-3 max-w-[34rem] text-[15px] leading-relaxed text-fg-muted">
                {client.description}
              </p>

              {client.url && (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[13px] text-accent underline decoration-accent-dim underline-offset-4 transition-colors hover:decoration-accent"
                >
                  ver sitio
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              )}
            </div>

            {client.image && (
              <div className="shrink-0 overflow-hidden rounded-[4px] border border-line md:w-[260px]">
                <Image
                  src={client.image}
                  alt={`Captura de ${client.org}`}
                  sizes="(max-width: 768px) 100vw, 260px"
                  className="aspect-16/10 w-full object-cover object-top"
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </Panel>
  )
}
