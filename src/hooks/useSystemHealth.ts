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
 * Techo de espera del health check.
 *
 * Sin timeout, un servidor caído no hace fallar el fetch: lo deja COLGADO, y
 * el estado se queda en `loading` para siempre mostrando "CONNECTING" sin un
 * solo error en consola. Un indicador que miente diciendo "conectando" cuando
 * en realidad no hay nadie del otro lado es peor que uno que admite el fallo.
 */
const HEALTH_TIMEOUT_MS = 5000

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
    // Sólo lo marca el cleanup. Permite distinguir un abort por desmontaje
    // —donde no hay que tocar el estado— de uno por timeout, que SÍ es un fallo.
    let unmounted = false

    const timeout = window.setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS)

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
        if (unmounted) return
        setHealth({ state: 'down', latency: null, payload: null })
      } finally {
        window.clearTimeout(timeout)
      }
    }

    void check()

    return () => {
      unmounted = true
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  return health
}
