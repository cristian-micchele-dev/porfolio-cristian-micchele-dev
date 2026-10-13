import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBar } from './StatusBar'
import { SystemHealthProvider } from './SystemHealthProvider'

const healthPayload = {
  status: 'ok' as const,
  runtime: 'node 24.15.0',
  uptime: 42,
  commit: 'abc1234',
  region: 'gru1',
  env: 'production',
  timestamp: '2026-10-11T00:00:00.000Z',
}

const okFetch = () =>
  vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => healthPayload,
    headers: new Headers(),
  } as unknown as Response)

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('StatusBar — estado del sistema', () => {
  it('arranca en CONNECTING antes de la primera respuesta', () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise<never>(() => {})))
    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )

    expect(screen.getByText('CONNECTING')).toBeInTheDocument()
  })

  it('pasa a SYSTEM ONLINE cuando el health check responde', async () => {
    vi.stubGlobal('fetch', okFetch())
    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText('SYSTEM ONLINE')).toBeInTheDocument()
    expect(screen.queryByText('CONNECTING')).not.toBeInTheDocument()
  })

  it('muestra la latencia medida en lugar del placeholder', async () => {
    vi.stubGlobal('fetch', okFetch())
    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )

    await screen.findByText('SYSTEM ONLINE')
    expect(screen.getByText(/^\d+ms$/)).toBeInTheDocument()
  })

  it('pasa a DEGRADED si el fetch falla', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText('DEGRADED')).toBeInTheDocument()
  })

  it('pasa a DEGRADED si el endpoint responde con error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({}),
        headers: new Headers(),
      } as unknown as Response),
    )
    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText('DEGRADED')).toBeInTheDocument()
  })

  it('cae a DEGRADED si el servidor no responde, en lugar de colgarse', async () => {
    // Un servidor caído no hace fallar el fetch: lo deja colgado. Sin timeout
    // el estado se quedaba en CONNECTING para siempre y sin error en consola.
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () =>
              reject(new DOMException('aborted', 'AbortError')),
            )
          }),
      ),
    )

    render(
      <SystemHealthProvider>
        <StatusBar />
      </SystemHealthProvider>,
    )
    expect(screen.getByText('CONNECTING')).toBeInTheDocument()

    await vi.advanceTimersByTimeAsync(5000)
    vi.useRealTimers()

    expect(await screen.findByText('DEGRADED')).toBeInTheDocument()
  })

  it('se queda en CONNECTING si NADIE provee el contexto', () => {
    // Regresión: si la StatusBar quedara fuera del provider, el contexto
    // devuelve el fallback y el estado nunca avanza. Es exactamente el
    // sintoma de "dice connecting" y no da ningun error en consola.
    vi.stubGlobal('fetch', okFetch())
    render(<StatusBar />)

    expect(screen.getByText('CONNECTING')).toBeInTheDocument()
    expect(fetch).not.toHaveBeenCalled()
  })
})
