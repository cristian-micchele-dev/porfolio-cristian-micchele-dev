'use client'

import { useEffect, useState } from 'react'
import type { HealthPayload } from '@/app/api/health/route'

export interface SystemHealth {
  /** `loading` hasta la primera respuesta; `down` si el fetch falla. */
  state: 'loading' | 'online' | 'down'
  /** Round-trip medido en el cliente, en ms. Real, no decorativo. */
  latency: number | null
  payload: HealthPayload | null
}

/**
 * Consulta `GET /api/health` y mide la latencia real del round-trip.
 *
 * Una sola medición al montar: no hace polling. Un portfolio que pollea cada
 * 5s gasta batería y ancho de banda del visitante para refrescar un dato que
 * a nadie le cambia la vida.
 */
export function useSystemHealth(): SystemHealth {
  const [health, setHealth] = useState<SystemHealth>({
    state: 'loading',
    latency: null,
    payload: null,
  })

  useEffect(() => {
    const controller = new AbortController()

    const check = async () => {
      const started = performance.now()
      try {
        const res = await fetch('/api/health', {
          signal: controller.signal,
          cache: 'no-store',
        })
        const latency = Math.round(performance.now() - started)

        if (!res.ok) {
          setHealth({ state: 'down', latency, payload: null })
          return
        }

        const payload = (await res.json()) as HealthPayload
        setHealth({ state: 'online', latency, payload })
      } catch {
        if (controller.signal.aborted) return
        setHealth({ state: 'down', latency: null, payload: null })
      }
    }

    void check()
    return () => controller.abort()
  }, [])

  return health
}
