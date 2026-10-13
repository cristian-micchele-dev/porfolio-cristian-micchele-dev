import { describe, it, expect } from 'vitest'
import { projectKeywords } from './projectKeywords'

describe('projectKeywords', () => {
  it('incluye el nombre completo normalizado', () => {
    expect(projectKeywords('EchoVerse')).toContain('echoverse')
  })

  it('separa título y subtítulo en frases buscables', () => {
    const keywords = projectKeywords('Pulso — Gestión Hospitalaria')
    expect(keywords).toContain('gestion hospitalaria')
    expect(keywords).toContain('pulso')
  })

  it('descarta tokens genéricos que aparecerían en cualquier pregunta', () => {
    // Si "api" fuera keyword, "¿qué APIs hizo?" dispararía esta ficha en
    // lugar de la lista de proyectos.
    const keywords = projectKeywords('Parking Admin API')
    expect(keywords).not.toContain('api')
    expect(keywords).not.toContain('admin')
    expect(keywords).toContain('parking')
  })

  it('descarta artículos y preposiciones', () => {
    const keywords = projectKeywords('La Página Perdida')
    expect(keywords).not.toContain('la')
    expect(keywords).not.toContain('de')
    expect(keywords).toContain('pagina')
    expect(keywords).toContain('perdida')
  })

  it('descarta tokens demasiado cortos para identificar', () => {
    expect(projectKeywords('Robot 3D RenderLab')).not.toContain('3d')
  })

  it('pone las aliases primero: la gente abrevia', () => {
    const keywords = projectKeywords('Pulso — Gestión Hospitalaria', ['pulso'])
    expect(keywords[0]).toBe('pulso')
  })

  it('no repite keywords', () => {
    const keywords = projectKeywords('Pulso — Gestión Hospitalaria', ['pulso', 'PULSO'])
    expect(new Set(keywords).size).toBe(keywords.length)
  })

  it('normaliza tildes y mayúsculas', () => {
    const keywords = projectKeywords('La Página Perdida')
    expect(keywords.every((k) => k === k.toLowerCase())).toBe(true)
    expect(keywords.join(' ')).not.toContain('á')
  })

  it('no devuelve strings vacíos', () => {
    expect(projectKeywords('API')).not.toContain('')
    expect(projectKeywords('— ·')).toEqual([])
  })

  it('sobrevive a un nombre de una sola palabra genérica', () => {
    expect(projectKeywords('App')).toEqual(['app'])
  })
})
