import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { projects } from '@/data/projects'
import { caseStudy } from '@/data/caseStudy'

/**
 * `GET /api/projects/{id}` — el detalle.
 *
 * Dos cosas se protegen acá. Una: que el caso de estudio aparezca sólo en el
 * proyecto al que pertenece, porque adjuntarlo a otro sería atribuirle a un
 * proyecto decisiones que no se tomaron ahí.
 *
 * Dos: que el 404 siga listando los slugs válidos. Un 404 que no ayuda a
 * corregir la llamada es un 404 a medias, y esa cortesía es justo lo que se
 * pierde en el primer refactor si nadie la fija.
 */
const call = async (id: string) => {
  const response = await GET(new Request(`http://localhost/api/projects/${id}`), {
    params: Promise.resolve({ id }),
  })
  return { response, body: (await response.json()) as Record<string, unknown> }
}

describe('GET /api/projects/{id} — encontrado', () => {
  it('sirve cada proyecto de la fuente única', async () => {
    for (const project of projects) {
      const { response, body } = await call(project.id)
      const served = body.project as { id: string; name: string }

      expect(response.status, project.id).toBe(200)
      expect(served.id, project.id).toBe(project.id)
      expect(served.name, project.id).toBe(project.name)
    }
  })

  it('adjunta el caso de estudio sólo a su proyecto', async () => {
    const { body } = await call(caseStudy.projectId)
    const study = body.case as { headline: string; decisions: unknown[] }

    expect(study).not.toBeNull()
    expect(study.headline).toBe(caseStudy.headline)
    expect(study.decisions).toHaveLength(caseStudy.decisions.length)
  })

  it('los demás proyectos declaran case: null, no lo omiten', async () => {
    for (const project of projects.filter((p) => p.id !== caseStudy.projectId)) {
      const { body } = await call(project.id)

      expect(body, project.id).toHaveProperty('case')
      expect(body.case, project.id).toBeNull()
    }
  })

  it('cada decisión del caso viaja con su costo', async () => {
    const { body } = await call(caseStudy.projectId)
    const study = body.case as { decisions: Array<{ tradeoff?: string }> }

    for (const decision of study.decisions) {
      expect(decision.tradeoff?.trim()).toBeTruthy()
    }
  })
})

describe('GET /api/projects/{id} — no encontrado', () => {
  it('responde 404', async () => {
    expect((await call('no-existe')).response.status).toBe(404)
  })

  it('devuelve el id pedido y los slugs que sí valen', async () => {
    const { body } = await call('no-existe')

    expect(body.error).toBe('project_not_found')
    expect(body.id).toBe('no-existe')
    expect(body.available).toEqual(projects.map((p) => p.id))
  })

  it('no cachea el 404: mañana ese slug puede existir', async () => {
    expect((await call('no-existe')).response.headers.get('Cache-Control')).toBe('no-store')
  })
})
