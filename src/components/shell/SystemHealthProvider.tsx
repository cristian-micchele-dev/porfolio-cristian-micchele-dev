'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSystemHealth, type SystemHealth } from '@/hooks/useSystemHealth'

const FALLBACK: SystemHealth = { state: 'loading', latency: null, payload: null }

const SystemHealthContext = createContext<SystemHealth>(FALLBACK)

/**
 * Una sola consulta a `GET /api/health` para toda la app.
 *
 * La StatusBar, el SystemPanel y el LogFooter muestran la misma telemetría.
 * Con un hook por componente habría tres fetches y —peor— tres latencias
 * distintas en pantalla al mismo tiempo. En un sitio cuyo argumento es que
 * los números son reales, eso se nota.
 */
export function SystemHealthProvider({ children }: { children: ReactNode }) {
  const health = useSystemHealth()
  return <SystemHealthContext.Provider value={health}>{children}</SystemHealthContext.Provider>
}

export function useSystemHealthContext(): SystemHealth {
  return useContext(SystemHealthContext)
}
