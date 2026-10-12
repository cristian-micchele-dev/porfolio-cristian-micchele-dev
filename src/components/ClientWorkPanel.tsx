import { ArrowUpRight } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { clientWork } from '@/data/clients'
import { formatMonthYear } from '@/lib/format'

/**
 * Trabajo freelance con clientes, como cierre de Projects.
 *
 * Deliberadamente NO usa la forma de `ProjectModule`: una optimización SEO no
 * tiene stack, ni arquitectura, ni deployment, y forzarla a esos campos
 * produciría una card medio vacía al lado de Pulso. Tres líneas por cliente
 * transmiten la señal que importa —trabajó para gente que pagó— sin competir
 * con los proyectos técnicos.
 */
export function ClientWorkPanel() {
  return (
    <Panel
      label="freelance · clientes"
      headerRight={
        <span className="label-mono tabular-nums text-fg-faint">{clientWork.length}</span>
      }
    >
      <ul className="divide-y divide-line">
        {clientWork.map((client) => (
          <li key={client.id}>
            <a
              href={client.url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-1 px-4 py-3 transition-colors hover:bg-surface-hi sm:flex-row sm:items-baseline sm:gap-4"
            >
              <span className="label-mono shrink-0 whitespace-nowrap tabular-nums text-fg-faint">
                {formatMonthYear(client.date)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-[15px] text-fg">
                  {client.org}
                  <span className="text-fg-faint"> · </span>
                  <span className="text-fg-muted">{client.title}</span>
                </span>
                <span className="mt-0.5 block font-mono text-[13px] text-accent">
                  {client.role}
                </span>
              </span>

              <ArrowUpRight
                size={14}
                aria-hidden="true"
                className="hidden shrink-0 text-fg-faint transition-colors group-hover:text-accent sm:block"
              />
            </a>
          </li>
        ))}
      </ul>
    </Panel>
  )
}
