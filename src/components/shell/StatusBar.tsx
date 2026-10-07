'use client'

import { navSections, sections } from '@/data/sections'
import { useActiveSection } from '@/hooks/useActiveSection'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import { formatLatency } from '@/lib/format'
import { cn } from '@/lib/cn'
import { StatusDot } from '@/components/primitives/StatusDot'
import { SECTION_IDS } from '@/types/content'

const STATE_LABEL = {
  loading: 'CONNECTING',
  online: 'SYSTEM ONLINE',
  down: 'DEGRADED',
} as const

/**
 * Barra de sistema fija. DESIGN.md §5.
 *
 * No es una nav decorada: es el indicador de estado del sitio. Es el ÚNICO
 * lugar donde se permite backdrop-blur en todo el proyecto.
 */
export function StatusBar() {
  const active = useActiveSection(SECTION_IDS)
  const { state, latency } = useSystemHealth()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-12 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1200px] items-center gap-6 px-4 sm:px-6">
        <a
          href="#identity"
          className="font-mono text-sm font-medium text-fg transition-colors hover:text-accent"
        >
          cristian<span className="text-fg-faint">.dev</span>
        </a>

        <nav aria-label="Secciones" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navSections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? 'true' : undefined}
                  className={cn(
                    'rounded-[4px] px-2.5 py-1.5 font-mono text-[13px] transition-colors',
                    active === section.id
                      ? 'text-accent'
                      : 'text-fg-muted hover:text-fg',
                  )}
                >
                  /{section.navLabel}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <span className="hidden font-mono text-[13px] tabular-nums text-fg-muted sm:inline">
            {formatLatency(latency)}
          </span>
          <StatusDot
            tone={state === 'online' ? 'ok' : state === 'down' ? 'err' : 'muted'}
            label={STATE_LABEL[state]}
            visuallyHidden={false}
            labelClassName="label-mono text-fg-muted"
          />
        </div>
      </div>

      {/* Indicador de progreso de sección, solo mobile: reemplaza la nav oculta */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-line md:hidden">
        <div
          className="h-full bg-accent transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: `${((sections.findIndex((s) => s.id === active) + 1) / sections.length) * 100}%`,
          }}
        />
      </div>
    </header>
  )
}
