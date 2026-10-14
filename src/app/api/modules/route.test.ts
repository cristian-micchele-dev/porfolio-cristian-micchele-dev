import { describe, it, expect } from 'vitest'
import { GET } from './route'
import { moduleGroups } from '@/data/stack'
import { certificates } from '@/data/certificates'

/**
 * `GET /api/modules` — el stack servido.
 *
 * Lo que se protege: que los conteos del resumen coincidan con el detalle que
 * viaja en la misma respuesta. Un payload que dice `modules: 24` y adjunta 23
 * es peor que no mandar el conteo, porque invita a confiar en él.
 */
const body = async () => (await GET()).json() as Promise<Record<string, unknown>>

type Group = { id: string; label: string; modules: Array<{ name: string; status: string }> }

describe('GET /api/modules', () => {
  it('sirve los mismos grupos que la fuente única', async () => {
    const groups = (await body()).groups_detail as Group[]

    expect(groups.map((g) => g.id)).toEqual(moduleGroups.map((g) => g.id))
  })

  it('el conteo de módulos coincide con el detalle que manda', async () => {
    const payload = await body()
    const detail = payload.groups_detail as Group[]
    const counted = detail.reduce((total, group) => total + group.modules.length, 0)

    expect(payload.modules).toBe(counted)
  })

  it('el conteo de grupos coincide con el detalle', async () => {
    const payload = await body()

    expect(payload.groups).toBe((payload.groups_detail as Group[]).length)
  })

  it('active + learning suma el total: ningún módulo queda sin clasificar', async () => {
    const payload = await body()

    expect(Number(payload.active) + Number(payload.learning)).toBe(payload.modules)
  })

  it('cada módulo declara un estado real, nunca un porcentaje', async () => {
    const groups = (await body()).groups_detail as Group[]

    for (const group of groups) {
      for (const tech of group.modules) {
        expect(['active', 'learning'], `${group.id}/${tech.name}`).toContain(tech.status)
      }
    }
  })

  it('sirve las certificaciones con su credencial verificable', async () => {
    const served = (await body()).certifications as Array<{ id: string; credential: string }>

    expect(served.map((c) => c.id)).toEqual(certificates.map((c) => c.id))
    for (const certificate of served) {
      expect(certificate.credential, certificate.id).toMatch(/^https:\/\//)
    }
  })

  it('es cacheable en el edge: el stack no cambia entre requests', async () => {
    expect((await GET()).headers.get('Cache-Control')).toContain('s-maxage')
  })
})
