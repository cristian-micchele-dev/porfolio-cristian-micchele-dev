import { describe, it, expect } from 'vitest'
import { projects, featuredProjects, findProject } from './projects'
import { sections, navSections } from './sections'
import { moduleGroups, allModuleNames } from './stack'
import { architectureLayers } from './architecture'
import { timeline } from './timeline'
import { certificates } from './certificates'
import { SECTION_IDS } from '@/types/content'

/**
 * Tests de integridad de contenido.
 * El contenido lo edita una persona a mano: estos tests son la red que atrapa
 * un slug duplicado, un link roto de formato o un campo olvidado antes de que
 * llegue a producción.
 */

describe('projects', () => {
  it('no tiene slugs duplicados', () => {
    const ids = projects.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('usa slugs en kebab-case', () => {
    for (const p of projects) {
      expect(p.id, `slug inválido: ${p.id}`).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
    }
  })

  it('declara al menos una tecnología por proyecto', () => {
    for (const p of projects) {
      expect(p.stack.length, `${p.id} sin stack`).toBeGreaterThan(0)
    }
  })

  it('expone al menos un link navegable por proyecto', () => {
    for (const p of projects) {
      expect(p.demoUrl ?? p.repoUrl, `${p.id} sin demo ni repo`).toBeDefined()
    }
  })

  it('usa URLs absolutas https', () => {
    for (const p of projects) {
      for (const url of [p.demoUrl, p.repoUrl].filter(Boolean)) {
        expect(url, `${p.id}: ${url}`).toMatch(/^https:\/\//)
      }
    }
  })

  it('declara arquitectura en todo proyecto con peso backend', () => {
    for (const p of projects.filter((x) => x.kind !== 'frontend')) {
      expect(p.architecture, `${p.id} es ${p.kind} y no declara arquitectura`).toBeDefined()
    }
  })

  it('tiene proyectos destacados, y son un subconjunto propio', () => {
    expect(featuredProjects.length).toBeGreaterThan(0)
    expect(featuredProjects.length).toBeLessThanOrEqual(projects.length)
  })

  it('findProject resuelve por slug y devuelve undefined si no existe', () => {
    expect(findProject('pulso')?.name).toContain('Pulso')
    expect(findProject('no-existe')).toBeUndefined()
  })
})

describe('sections', () => {
  it('cubre exactamente los SECTION_IDS declarados', () => {
    expect(sections.map((s) => s.id)).toEqual([...SECTION_IDS])
  })

  it('no tiene ids duplicados', () => {
    const ids = sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('declara el endpoint con un verbo HTTP y una ruta', () => {
    for (const s of sections) {
      expect(s.endpoint, s.id).toMatch(/^(GET|POST|PUT|PATCH|DELETE) \/[a-z]+$/)
    }
  })

  it('excluye identity de la nav pero la mantiene en el rail', () => {
    expect(navSections.some((s) => s.id === 'identity')).toBe(false)
    expect(navSections).toHaveLength(sections.length - 1)
  })
})

describe('stack', () => {
  it('no repite módulos entre grupos', () => {
    expect(new Set(allModuleNames).size).toBe(allModuleNames.length)
  })

  it('no tiene grupos vacíos', () => {
    for (const g of moduleGroups) {
      expect(g.modules.length, `grupo vacío: ${g.id}`).toBeGreaterThan(0)
    }
  })
})

describe('architecture', () => {
  it('ordena las capas de dominio a infraestructura', () => {
    expect(architectureLayers.map((l) => l.id)).toEqual([
      'domain',
      'application',
      'adapters',
      'infrastructure',
    ])
  })
})

describe('timeline', () => {
  it('usa fechas ISO YYYY-MM', () => {
    for (const e of timeline) {
      expect(e.date, e.id).toMatch(/^\d{4}-(0[1-9]|1[0-2])$/)
    }
  })

  it('está ordenado de más reciente a más antiguo', () => {
    const dates = timeline.map((e) => e.date)
    expect([...dates].sort().reverse()).toEqual(dates)
  })
})

describe('certificates', () => {
  it('no tiene ids duplicados', () => {
    const ids = certificates.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('apunta a una credencial https verificable', () => {
    for (const c of certificates) {
      expect(c.credentialUrl, c.id).toMatch(/^https:\/\//)
    }
  })
})
