import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LogFooter } from './LogFooter'
import { SystemHealthProvider } from './SystemHealthProvider'
import { profile } from '@/data/profile'
import { stripProtocol } from '@/lib/format'

const healthPayload = {
  status: 'ok' as const,
  runtime: 'node 24.15.0',
  uptime: 42,
  commit: 'abc1234',
  region: 'gru1',
  env: 'production',
  timestamp: '2026-10-08T00:00:00.000Z',
}

beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => healthPayload,
      headers: new Headers(),
    } as unknown as Response),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LogFooter', () => {
  it('es un landmark de footer', () => {
    render(<LogFooter />)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('arranca con el evento de carga del perfil', () => {
    render(<LogFooter />)
    expect(screen.getByText('profile loaded')).toBeInTheDocument()
  })

  it('loguea el health check REAL con su latencia, no una línea inventada', async () => {
    render(
      <SystemHealthProvider>
        <LogFooter />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText(/GET \/api\/health 200 · \d+ms/)).toBeInTheDocument()
  })

  it('loguea el runtime y el uptime que devolvió el servidor', async () => {
    render(
      <SystemHealthProvider>
        <LogFooter />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText(/runtime node 24\.15\.0 · uptime 42s/)).toBeInTheDocument()
  })

  it('no inventa una línea de base de datos: no hay base de datos', async () => {
    render(
      <SystemHealthProvider>
        <LogFooter />
      </SystemHealthProvider>,
    )
    await screen.findByText(/GET \/api\/health/)

    expect(screen.queryByText(/\[database\]/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/connection established/i)).not.toBeInTheDocument()
  })

  it('reporta el fallo del health check en lugar de ocultarlo', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))

    render(
      <SystemHealthProvider>
        <LogFooter />
      </SystemHealthProvider>,
    )

    expect(await screen.findByText('GET /api/health failed')).toBeInTheDocument()
  })

  it('acota las líneas visibles para que el log no crezca sin fin', async () => {
    render(
      <SystemHealthProvider>
        <LogFooter />
      </SystemHealthProvider>,
    )
    await screen.findByText(/runtime node/)

    expect(screen.getAllByRole('listitem').length).toBeLessThanOrEqual(4)
  })

  it('no es una región aria-live: sería ruido constante para un lector', () => {
    render(<LogFooter />)
    expect(screen.getByLabelText(/log de la sesión/i)).toHaveAttribute('aria-live', 'off')
  })

  it('identifica el perfil y linkea al código fuente', () => {
    render(<LogFooter />)

    expect(screen.getByText(new RegExp(profile.name))).toBeInTheDocument()
    const source = screen.getByRole('link', { name: stripProtocol(profile.sourceRepo) })
    expect(source).toHaveAttribute('href', profile.sourceRepo)
    expect(source).toHaveAttribute('target', '_blank')
  })

  it('declara que no hay analytics ni cookies', () => {
    render(<LogFooter />)
    expect(screen.getByText(/sin analytics ni cookies/i)).toBeInTheDocument()
  })
})
