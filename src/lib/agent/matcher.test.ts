import { describe, it, expect } from 'vitest'
import { normalize, scoreEntry, matchEntry } from './matcher'
import type { KnowledgeEntry } from './types'

const entry = (id: string, keywords: string[]): KnowledgeEntry => ({
  id,
  prompt: id,
  keywords,
  answer: () => [{ kind: 'text', text: id }],
})

describe('normalize', () => {
  it('baja a minúsculas', () => {
    expect(normalize('NestJS')).toBe('nestjs')
  })

  it('saca tildes y diéresis', () => {
    expect(normalize('¿Qué arquitectura usá?')).toBe('que arquitectura usa')
  })

  it('saca signos de pregunta y puntuación', () => {
    expect(normalize('¿Cómo lo contacto?')).toBe('como lo contacto')
  })

  it('preserva el punto de node.js y next.js', () => {
    expect(normalize('Usa Node.js y Next.js?')).toBe('usa node.js y next.js')
  })

  it('preserva el + de c++ y el # de c#', () => {
    expect(normalize('C++ o C#')).toBe('c++ o c#')
  })

  it('colapsa espacios y recorta', () => {
    expect(normalize('  hola   mundo  ')).toBe('hola mundo')
  })

  it('devuelve vacío para entrada vacía o sólo símbolos', () => {
    expect(normalize('')).toBe('')
    expect(normalize('   ')).toBe('')
    expect(normalize('¿¿??!!')).toBe('')
  })

  it('maneja la ñ', () => {
    expect(normalize('España')).toBe('espana')
  })
})

describe('scoreEntry', () => {
  it('suma uno por palabra suelta que coincide', () => {
    expect(scoreEntry('que stack usa', entry('a', ['stack']))).toBe(1)
  })

  it('no puntúa cuando no hay coincidencia', () => {
    expect(scoreEntry('que stack usa', entry('a', ['arquitectura']))).toBe(0)
  })

  it('pesa más las frases que las palabras sueltas', () => {
    const phrase = scoreEntry('usa arquitectura hexagonal', entry('a', ['arquitectura hexagonal']))
    const word = scoreEntry('usa arquitectura hexagonal', entry('b', ['arquitectura']))
    expect(phrase).toBeGreaterThan(word)
  })

  it('acumula varias coincidencias', () => {
    expect(scoreEntry('stack y arquitectura', entry('a', ['stack', 'arquitectura']))).toBe(2)
  })

  it('exige palabra completa: no matchea dentro de otra palabra', () => {
    // `nest` no debe disparar con `honesto`
    expect(scoreEntry('es honesto', entry('a', ['nest']))).toBe(0)
  })

  it('tolera plurales en keywords largas', () => {
    expect(scoreEntry('que proyectos tiene', entry('a', ['proyecto']))).toBe(1)
    expect(scoreEntry('cuantas tecnologias usa', entry('b', ['tecnologia']))).toBe(1)
  })

  it('no aplica prefijo laxo a keywords cortas', () => {
    // `api` no debe disparar con `apikey` por accidente
    expect(scoreEntry('apikey', entry('a', ['api']))).toBe(0)
  })

  it('es insensible a tildes en la pregunta y en la keyword', () => {
    expect(scoreEntry('¿Qué ARQUITECTURA?', entry('a', ['arquitectura']))).toBe(1)
  })

  it('matchea keywords en inglés sobre contenido en español', () => {
    expect(scoreEntry('what architecture does he use', entry('a', ['architecture']))).toBe(1)
  })
})

describe('matchEntry', () => {
  const entries = [
    entry('projects', ['proyecto', 'projects', 'trabajos']),
    entry('stack', ['stack', 'tecnologia', 'technologies']),
    entry('arch', ['arquitectura', 'architecture', 'arquitectura hexagonal']),
  ]

  it('elige la entrada con mayor puntaje', () => {
    expect(matchEntry('que proyectos hizo', entries)?.id).toBe('projects')
    expect(matchEntry('what is his stack', entries)?.id).toBe('stack')
  })

  it('prefiere la coincidencia de frase sobre la de palabra', () => {
    expect(matchEntry('usa arquitectura hexagonal?', entries)?.id).toBe('arch')
  })

  it('devuelve null cuando nada supera el umbral', () => {
    expect(matchEntry('cual es la capital de francia', entries)).toBeNull()
  })

  it('devuelve null para pregunta vacía', () => {
    expect(matchEntry('', entries)).toBeNull()
    expect(matchEntry('   ', entries)).toBeNull()
  })

  it('devuelve null con lista de entradas vacía', () => {
    expect(matchEntry('proyectos', [])).toBeNull()
  })

  it('ante empate respeta el orden de declaración', () => {
    const tied = [entry('primero', ['hola']), entry('segundo', ['hola'])]
    expect(matchEntry('hola', tied)?.id).toBe('primero')
  })
})
