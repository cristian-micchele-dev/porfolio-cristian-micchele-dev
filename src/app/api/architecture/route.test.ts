import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { architectureConcepts, architectureLayers } from '@/data/architecture'

/**
 * `GET /api/architecture`.
 *
 * Ninguna sección lo renderiza desde que se sacó la sección de Arquitectura, y
 * se mantuvo a propósito: el contrato de DESIGN.md §8 pide que todo lo que la
 * UI exhibe exista, no que todo lo que existe se exhiba. Pero un endpoint que
 * nadie mira es justo el que se rompe sin que nadie se entere — por eso tiene
 * test.
 *
 * El dato que importa es `dependency_direction: inward`. Es la misma regla que
 * `src/lib/layers.test.ts` hace cumplir en el código: si el endpoint la
 * declarara al revés, el sitio estaría documentando una arquitectura que no
 * tiene.
 */
const body = async () => (await GET()).json() as Promise<Record<string, unknown>>

type Layer = { id: string; name: string; depth: number }

describe('GET /api/architecture', () => {
  it('declara el estilo y la dirección de las dependencias', async () => {
    const payload = await body()

    expect(payload.style).toBe('hexagonal')
    expect(payload.dependency_direction).toBe('inward')
  })

  it('sirve las mismas capas que la fuente única', async () => {
    const layers = (await body()).layers as Layer[]

    expect(layers.map((l) => l.id)).toEqual(architectureLayers.map((l) => l.id))
  })

  it('cada capa declara su profundidad explícita, sin depender del orden', async () => {
    const layers = (await body()).layers as Layer[]

    for (const layer of layers) {
      expect(typeof layer.depth, layer.id).toBe('number')
      expect(layer.depth, layer.id).toBeGreaterThanOrEqual(0)
    }
  })

  it('existe un núcleo en depth 0: "hacia adentro" necesita un adentro', async () => {
    const depths = ((await body()).layers as Layer[]).map((l) => l.depth)

    expect(depths).toContain(0)
  })

  it('las profundidades no se repiten: dos capas no pueden ser el mismo anillo', async () => {
    const depths = ((await body()).layers as Layer[]).map((l) => l.depth)

    expect([...new Set(depths)]).toHaveLength(depths.length)
  })

  it('sirve los conceptos de la fuente única, con su descripción', async () => {
    const concepts = (await body()).concepts as Array<{ name: string; description: string }>

    expect(concepts.map((c) => c.name)).toEqual(architectureConcepts.map((c) => c.name))
    for (const concept of concepts) {
      expect(concept.description?.trim(), concept.name).toBeTruthy()
    }
  })

  it('es cacheable en el edge', async () => {
    expect((await GET()).headers.get('Cache-Control')).toContain('s-maxage')
  })
})
