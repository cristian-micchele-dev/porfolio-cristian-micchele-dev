import { describe, it, expect, vi, afterEach } from 'vitest'
import { GET } from './route'
import type { HealthPayload } from './route'

/**
 * `GET /api/health` — la telemetría que el sitio exhibe.
 *
 * DESIGN.md §8: nada de métricas hardcodeadas. Este endpoint es el que
 * sostiene esa afirmación, así que lo que se verifica no es que "devuelva
 * datos" sino que los datos **se muevan**: dos llamadas separadas no pueden
 * dar el mismo timestamp, y el uptime tiene que salir del proceso real.
 *
 * Un número fijo acá convierte la honestidad del portfolio en decoración.
 */
const payload = async () => (await GET()).json() as Promise<HealthPayload>

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('GET /api/health', () => {
  it('reporta ok', async () => {
    expect((await payload()).status).toBe('ok')
  })

  it('el runtime sale de process.versions, no de una constante', async () => {
    expect((await payload()).runtime).toBe(`node ${process.versions.node}`)
  })

  it('el uptime es un número real del proceso, no un valor fijo', async () => {
    const { uptime } = await payload()

    expect(typeof uptime).toBe('number')
    expect(Number.isInteger(uptime)).toBe(true)
    expect(uptime).toBeGreaterThanOrEqual(0)
    expect(uptime).toBeLessThanOrEqual(Math.ceil(process.uptime()) + 1)
  })

  it('el timestamp avanza entre llamadas: la respuesta no está congelada', async () => {
    const first = await payload()
    await new Promise((r) => setTimeout(r, 5))
    const second = await payload()

    expect(Date.parse(second.timestamp)).toBeGreaterThanOrEqual(Date.parse(first.timestamp))
    expect(() => new Date(first.timestamp).toISOString()).not.toThrow()
  })

  it('acorta el commit a SHA corto cuando la plataforma lo expone', async () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', 'abcdef1234567890')

    expect((await payload()).commit).toBe('abcdef1')
  })

  it('admite null en lugar de inventar un commit cuando no hay', async () => {
    vi.stubEnv('VERCEL_GIT_COMMIT_SHA', '')

    expect((await payload()).commit).toBeNull()
  })

  it('admite null en lugar de inventar una región', async () => {
    vi.stubEnv('VERCEL_REGION', '')

    expect((await payload()).region).toBeNull()
  })

  it('no se cachea: una telemetría cacheada es una telemetría falsa', async () => {
    expect((await GET()).headers.get('Cache-Control')).toBe('no-store')
  })
})
