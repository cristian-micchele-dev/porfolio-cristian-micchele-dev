import { describe, it, expect } from 'vitest'
import {
  serializeCase,
  serializeConcept,
  serializeLayer,
  serializeModuleGroup,
  serializeProject,
} from './serialize'
import { projects } from '@/data/projects'
import { caseStudy } from '@/data/caseStudy'
import { moduleGroups } from '@/data/stack'
import { architectureConcepts, architectureLayers } from '@/data/architecture'

const pulso = projects.find((p) => p.id === 'pulso')!
const seishin = projects.find((p) => p.id === 'seishin-dojo')!

describe('serializeProject', () => {
  it('expone la imagen como ruta, no el objeto del bundler', () => {
    const payload = serializeProject(pulso)
    expect(typeof payload.image).toBe('string')
    expect(payload).not.toHaveProperty('blurDataURL')
  })

  it('no filtra internals de StaticImageData en ningún proyecto', () => {
    for (const project of projects) {
      const serialized = JSON.stringify(serializeProject(project))
      expect(serialized, project.id).not.toContain('blurDataURL')
      expect(serialized, project.id).not.toContain('blurWidth')
    }
  })

  it('usa null explícito en los campos opcionales ausentes', () => {
    const payload = serializeProject(seishin)
    // `null` y no campo faltante: el consumidor no debería tener que
    // distinguir "no aplica" de "se olvidaron de mandarlo".
    expect(payload.architecture).toBeNull()
    expect(payload).toHaveProperty('architecture')
  })

  it('agrupa los links en lugar de dejarlos sueltos', () => {
    const payload = serializeProject(pulso)
    expect(payload.links).toEqual({ demo: pulso.demoUrl, repo: pulso.repoUrl })
  })

  it('devuelve array vacío, nunca undefined, en highlights', () => {
    expect(serializeProject(seishin).highlights).toEqual([])
  })

  it('incluye un self link navegable', () => {
    expect(serializeProject(pulso).self).toBe('/api/projects/pulso')
  })

  it('no comparte referencias con los datos: mutar la respuesta no corrompe la fuente', () => {
    const payload = serializeProject(pulso)
    payload.stack.push('CORRUPTO')
    expect(pulso.stack).not.toContain('CORRUPTO')
  })

  it('es serializable a JSON sin pérdida', () => {
    for (const project of projects) {
      const payload = serializeProject(project)
      expect(JSON.parse(JSON.stringify(payload)), project.id).toEqual(payload)
    }
  })
})

describe('serializeCase', () => {
  it('conserva las decisiones con su costo', () => {
    const payload = serializeCase(caseStudy)
    expect(payload.decisions).toHaveLength(caseStudy.decisions.length)
    for (const decision of payload.decisions) {
      expect(decision.tradeoff.length).toBeGreaterThan(0)
    }
  })

  it('no comparte referencias con los datos', () => {
    const payload = serializeCase(caseStudy)
    payload.decisions[0]!.title = 'CORRUPTO'
    expect(caseStudy.decisions[0]!.title).not.toBe('CORRUPTO')
  })
})

describe('serializeModuleGroup', () => {
  it('serializa cada grupo con sus módulos y estados', () => {
    for (const group of moduleGroups) {
      const payload = serializeModuleGroup(group)
      expect(payload.modules, group.id).toHaveLength(group.modules.length)
      expect(payload.modules.every((m) => m.status === 'active' || m.status === 'learning')).toBe(
        true,
      )
    }
  })
})

describe('serializeLayer', () => {
  it('expone la profundidad explícita: el orden del array no comunica intención', () => {
    const layers = architectureLayers.map(serializeLayer)
    expect(layers.map((l) => l.depth)).toEqual([0, 1, 2, 3])
    expect(layers[0]!.name).toBe('domain')
  })
})

describe('serializeConcept', () => {
  it('devuelve sólo nombre y descripción', () => {
    const payload = serializeConcept(architectureConcepts[0]!)
    expect(Object.keys(payload).sort()).toEqual(['description', 'name'])
  })
})
