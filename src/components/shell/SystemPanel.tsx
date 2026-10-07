'use client'

import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { useSystemHealth } from '@/hooks/useSystemHealth'
import { formatLatency } from '@/lib/format'

/**
 * Telemetría del sistema. DESIGN.md §8 — todo lo de acá sale de
 * `GET /api/health` o se mide en el cliente.
 *
 * El brief pedía también `DATABASE: CONNECTED`. No se muestra: este sitio no
 * tiene base de datos, y mostrar una conexión inexistente es exactamente la
 * métrica inventada que el contrato prohíbe. Si mañana hay base, el dato entra
 * acá con su valor real.
 */
export function SystemPanel() {
  const { state, latency, payload } = useSystemHealth()

  const rows: Array<{ label: string; value: string }> = [
    { label: 'api', value: state === 'online' ? '200 OK' : state === 'down' ? '503' : '…' },
    { label: 'latency', value: formatLatency(latency) },
    { label: 'runtime', value: payload?.runtime ?? '…' },
    { label: 'uptime', value: payload ? `${payload.uptime}s` : '…' },
    { label: 'region', value: payload?.region ?? 'local' },
    { label: 'build', value: payload?.commit ?? payload?.env ?? '…' },
  ]

  return (
    <Panel
      label="system"
      headerRight={
        <StatusDot
          tone={state === 'online' ? 'ok' : state === 'down' ? 'err' : 'muted'}
          label={state === 'online' ? 'online' : state === 'down' ? 'degraded' : 'checking'}
          visuallyHidden={false}
          labelClassName="label-mono text-fg-muted"
        />
      }
    >
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 p-4">
        {rows.map((row) => (
          <div key={row.label} className="min-w-0">
            <dt className="label-mono text-fg-faint">{row.label}</dt>
            <dd className="truncate font-mono text-[13px] text-fg tabular-nums">{row.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  )
}
