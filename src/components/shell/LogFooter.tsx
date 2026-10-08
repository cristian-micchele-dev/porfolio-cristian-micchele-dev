'use client'

import { useEffect, useRef, useState } from 'react'
import { profile } from '@/data/profile'
import { sections } from '@/data/sections'
import { formatLatency, stripProtocol } from '@/lib/format'
import { useActiveSectionContext } from './ActiveSectionProvider'
import { useSystemHealthContext } from './SystemHealthProvider'

interface LogEntry {
  id: number
  channel: 'system' | 'api' | 'ui'
  message: string
}

const MAX_VISIBLE = 4

const CHANNEL_COLOR = {
  system: 'text-fg-faint',
  api: 'text-accent',
  ui: 'text-ok',
} as const

/**
 * Log de la sesión.
 *
 * El brief pedía "logs ocasionales" tipo `[database] connection established`.
 * Están, pero son EVENTOS REALES: el fetch de health con su latencia medida y
 * los cambios de sección que produce el visitante al scrollear. No hay línea
 * de base de datos porque no hay base de datos (DESIGN.md §8).
 *
 * Un log inventado que corre solo es un GIF. Uno que reacciona a lo que hacés
 * es un sistema.
 */
export function LogFooter() {
  const active = useActiveSectionContext()
  const { state, latency, payload } = useSystemHealthContext()

  const [entries, setEntries] = useState<LogEntry[]>([
    { id: 0, channel: 'system', message: 'profile loaded' },
  ])
  const nextId = useRef(1)
  const lastSection = useRef<string | null>(null)
  const healthLogged = useRef(false)

  const push = (channel: LogEntry['channel'], message: string) => {
    setEntries((prev) => {
      const next = [...prev, { id: nextId.current++, channel, message }]
      return next.slice(-MAX_VISIBLE)
    })
  }

  /* El resultado real del health check, una sola vez. */
  useEffect(() => {
    if (healthLogged.current || state === 'loading') return
    healthLogged.current = true

    if (state === 'online') {
      push('api', `GET /api/health 200 · ${formatLatency(latency)}`)
      if (payload) push('system', `runtime ${payload.runtime} · uptime ${payload.uptime}s`)
    } else {
      push('api', 'GET /api/health failed')
    }
  }, [state, latency, payload])

  /* Los cambios de sección que produce el visitante. */
  useEffect(() => {
    if (!active || active === lastSection.current) return
    const previous = lastSection.current
    lastSection.current = active
    // La primera sección no se loguea: no es una navegación, es dónde entró.
    if (previous === null) return

    const meta = sections.find((s) => s.id === active)
    push('ui', `section → ${meta?.endpoint ?? active}`)
  }, [active])

  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div
          aria-label="Log de la sesión"
          aria-live="off"
          className="rounded-panel border border-line bg-surface p-4 font-mono text-[13px]"
        >
          <ol className="space-y-1">
            {entries.map((entry) => (
              <li key={entry.id} className="flex gap-2">
                <span className={`shrink-0 ${CHANNEL_COLOR[entry.channel]}`}>
                  [{entry.channel}]
                </span>
                <span className="min-w-0 text-fg-muted">{entry.message}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-sm text-fg">
              cristian<span className="text-fg-faint">.dev</span>
            </p>
            <p className="mt-1 text-[15px] text-fg-muted">
              {profile.name} — {profile.role}, {profile.specialization}
            </p>
            <p className="mt-2 label-mono text-fg-faint">
              Next.js · TypeScript · Tailwind · sin analytics ni cookies
            </p>
          </div>

          <a
            href={profile.sourceRepo}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[13px] text-accent underline decoration-accent-dim underline-offset-4 transition-colors hover:decoration-accent"
          >
            {stripProtocol(profile.sourceRepo)}
          </a>
        </div>
      </div>
    </footer>
  )
}
