import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { GET } from './route'
import { profile } from '@/data/profile'

/**
 * `GET /api` — el mapa, y el test que lo obliga a ser cierto.
 *
 * DESIGN.md §8: nunca se muestra un link que da 404. El índice de la API es
 * el caso más expuesto de esa regla — es literalmente una lista de promesas.
 * Si alguien curlea el sitio y encuentra una ruta documentada que no existe,
 * el argumento entero del portfolio se cae.
 *
 * Por eso el test no verifica que el índice tenga "algunas" rutas: verifica
 * que CADA ruta listada tenga su route handler en disco.
 */
const body = async () => (await GET()).json() as Promise<Record<string, unknown>>

/** 'GET /api/projects/{id}' → src/app/api/projects/[id]/route.ts */
const routeFileFor = (entry: string): string => {
  const path = entry.split(' ')[1] ?? ''
  const segments = path
    .replace(/^\/api\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/^\{(.+)\}$/, '[$1]'))

  return resolve(process.cwd(), 'src/app/api', ...segments, 'route.ts')
}

describe('GET /api', () => {
  it('se identifica y enlaza al código', async () => {
    const payload = await body()

    expect(payload.service).toBeTruthy()
    expect(payload.source).toBe(profile.sourceRepo)
  })

  it('cada endpoint que promete existe en disco', async () => {
    const endpoints = Object.keys((await body()).endpoints as Record<string, string>)
    const missing = endpoints.filter((entry) => !existsSync(routeFileFor(entry)))

    expect(endpoints.length).toBeGreaterThan(0)
    expect(missing, `rutas prometidas sin handler:\n  ${missing.join('\n  ')}`).toEqual([])
  })

  it('detecta una promesa rota (el test se testea a sí mismo)', () => {
    expect(existsSync(routeFileFor('GET /api/inventado'))).toBe(false)
  })

  it('cada endpoint declara su método y una descripción', async () => {
    const endpoints = (await body()).endpoints as Record<string, string>

    for (const [entry, description] of Object.entries(endpoints)) {
      expect(entry, entry).toMatch(/^(GET|POST) \/api/)
      expect(description.length, entry).toBeGreaterThan(5)
    }
  })

  it('es cacheable en el edge: el mapa no cambia entre requests', async () => {
    expect((await GET()).headers.get('Cache-Control')).toContain('s-maxage')
  })
})
