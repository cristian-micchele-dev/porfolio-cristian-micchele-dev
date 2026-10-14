import { NextResponse } from 'next/server'

/**
 * Telemetría real del sistema. DESIGN.md §8.
 *
 * La status bar y el panel de sistema consumen esto. Nada de lo que se muestra
 * en la UI está hardcodeado: si alguien abre devtools, encuentra estos datos.
 * La latencia la mide el cliente como round-trip real contra este endpoint.
 */
export const dynamic = 'force-dynamic'
export const revalidate = 0

export interface HealthPayload {
  status: 'ok'
  runtime: string
  /** Segundos desde que arrancó el proceso. */
  uptime: number
  /** SHA corto del commit desplegado, si la plataforma lo expone. */
  commit: string | null
  region: string | null
  env: string
  timestamp: string
}

export async function GET() {
  // `||` y no `??` en las variables de plataforma: una env var declarada pero
  // vacía llega como string vacío, y `??` la dejaría pasar. Serviría
  // `region: ""` como si fuera un dato — que es exactamente la métrica
  // decorativa que DESIGN.md §8 prohíbe. Si no se puede obtener, va null.
  const commit = process.env.VERCEL_GIT_COMMIT_SHA?.trim() || null
  const region = process.env.VERCEL_REGION?.trim() || null

  const payload: HealthPayload = {
    status: 'ok',
    runtime: `node ${process.versions.node}`,
    uptime: Math.round(process.uptime()),
    commit: commit ? commit.slice(0, 7) : null,
    region,
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(payload, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
