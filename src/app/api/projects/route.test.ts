import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { projects } from '@/data/projects'
import { KIND_FILTERS } from '@/lib/projects'

/**
 * `GET /api/projects` — lo que la sección exhibe, servido de verdad.
 *
 * El contrato que importa: lo que devuelve el endpoint es lo mismo que se ve
 * en pantalla. Por eso los asserts comparan contra `src/data/projects`, la
 * fuente única, en vez de contra una lista copiada acá. Una expectativa
 * duplicada se desincroniza y deja de proteger justo cuando hace falta.
 */
const call = async (query = '') => {
  const response = await GET(new Request(`http://localhost/api/projects${query}`))
  return { response, body: (await response.json()) as Record<string, unknown> }
}

describe('GET /api/projects', () => {
  it('devuelve todos los proyectos sin filtro', async () => {
    const { body } = await call()

    expect(body.kind).toBe('all')
    expect(body.count).toBe(projects.length)
    expect(body.total).toBe(projects.length)
  })

  it('sirve los mismos ids que la fuente única', async () => {
    const { body } = await call()
    const ids = (body.projects as Array<{ id: string }>).map((p) => p.id)

    expect(ids).toEqual(projects.map((p) => p.id))
  })

  it('cada proyecto trae su propio enlace de detalle', async () => {
    const { body } = await call()

    for (const project of body.projects as Array<{ id: string; self: string }>) {
      expect(project.self).toBe(`/api/projects/${project.id}`)
    }
  })

  it('declara null explícito en vez de omitir campos que no aplican', async () => {
    const { body } = await call()

    for (const project of body.projects as Array<Record<string, unknown>>) {
      expect(project, String(project.id)).toHaveProperty('architecture')
      expect(project.links).toHaveProperty('demo')
      expect(project.links).toHaveProperty('repo')
    }
  })

  it('acepta todos los filtros que declara como válidos', async () => {
    for (const kind of KIND_FILTERS) {
      const { response, body } = await call(`?kind=${kind}`)

      expect(response.status, kind).toBe(200)
      expect(body.kind, kind).toBe(kind)
      expect(body.total, kind).toBe(projects.length)
    }
  })

  it('el filtro reduce de verdad: ningún resultado se cuela de otro tipo', async () => {
    for (const kind of KIND_FILTERS.filter((k) => k !== 'all')) {
      const { body } = await call(`?kind=${kind}`)
      const kinds = (body.projects as Array<{ kind: string }>).map((p) => p.kind)

      expect([...new Set(kinds)], kind).toEqual(kinds.length ? [kind] : [])
    }
  })

  it('rechaza un filtro inventado con 400 y dice cuáles valen', async () => {
    const { response, body } = await call('?kind=backend-ish')

    expect(response.status).toBe(400)
    expect(body.error).toBe('invalid_kind')
    expect(body.allowed).toEqual([...KIND_FILTERS])
  })

  it('no cachea un 400: el error depende de la query', async () => {
    const { response } = await call('?kind=inventado')

    expect(response.headers.get('Cache-Control')).toBe('no-store')
  })

  it('el header de total coincide con el cuerpo', async () => {
    const { response, body } = await call()

    expect(response.headers.get('X-Total-Count')).toBe(String(body.count))
  })
})
