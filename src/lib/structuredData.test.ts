import { describe, it, expect } from 'vitest'
import { buildPersonSchema, personSchemaJson } from './structuredData'
import { profile } from '@/data/profile'
import { allModuleNames } from '@/data/stack'
import { SITE_URL } from './site'

describe('buildPersonSchema', () => {
  const schema = buildPersonSchema()

  it('declara el contexto y el tipo que entienden los buscadores', () => {
    expect(schema['@context']).toBe('https://schema.org')
    expect(schema['@type']).toBe('Person')
  })

  it('sale de los datos, no de texto escrito aparte', () => {
    // Un JSON-LD a mano se desactualiza en el primer cambio y termina
    // declarándole a Google algo distinto de lo que dice la página.
    expect(schema.name).toBe(profile.name)
    expect(schema.description).toBe(profile.summary)
    expect(schema.jobTitle).toContain(profile.role)
    expect(schema.jobTitle).toContain(profile.specialization)
  })

  it('usa URLs absolutas: una relativa no resuelve en JSON-LD', () => {
    for (const url of [schema.url, schema.image, ...schema.sameAs]) {
      expect(url, url).toMatch(/^https?:\/\//)
    }
  })

  it('apunta la imagen a una ruta real del sitio', () => {
    expect(schema.image).toBe(`${SITE_URL}/opengraph-image`)
  })

  it('enlaza los perfiles con sameAs', () => {
    expect(schema.sameAs).toContain(profile.github)
    expect(schema.sameAs).toContain(profile.linkedin)
  })

  it('declara el stack completo en knowsAbout', () => {
    expect(schema.knowsAbout).toEqual([...allModuleNames])
    expect(schema.knowsAbout.length).toBeGreaterThan(0)
  })

  it('no tiene campos vacíos ni undefined', () => {
    for (const [key, value] of Object.entries(schema)) {
      expect(value, key).toBeDefined()
      if (typeof value === 'string') expect(value.length, key).toBeGreaterThan(0)
      if (Array.isArray(value)) expect(value.length, key).toBeGreaterThan(0)
    }
  })
})

describe('personSchemaJson', () => {
  it('produce JSON válido', () => {
    expect(() => JSON.parse(personSchemaJson().replace(/\\u003c/g, '<'))).not.toThrow()
  })

  it('escapa `<` para que no se pueda cerrar el script', () => {
    // Un `</script>` dentro del string rompería la etiqueta y habilitaría
    // inyección de markup, aunque el contenido sea propio.
    expect(personSchemaJson()).not.toContain('<')
  })
})
