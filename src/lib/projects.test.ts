import { describe, it, expect } from 'vitest'
import {
  KIND_FILTERS,
  STATUS_META,
  filterProjectsByKind,
  countProjectsByKind,
  buildQueryPath,
} from './projects'
import { projects } from '@/data/projects'
import type { Project } from '@/types/content'

const IMAGE_STUB = { src: '/stub.png', width: 1, height: 1 }

const make = (id: string, kind: Project['kind']): Project => ({
  id,
  kind,
  name: id,
  summary: `resumen de ${id}`,
  stack: [],
  status: 'live',
  deployment: 'Vercel',
  image: IMAGE_STUB,
  featured: false,
})

const sample = [
  make('a', 'backend'),
  make('b', 'frontend'),
  make('c', 'fullstack'),
  make('d', 'backend'),
]

describe('KIND_FILTERS', () => {
  it('arranca por "all" para que sea el estado por defecto', () => {
    expect(KIND_FILTERS[0]).toBe('all')
  })

  it('cubre los tres kinds del tipo Project', () => {
    expect([...KIND_FILTERS]).toEqual(['all', 'backend', 'fullstack', 'frontend'])
  })
})

describe('filterProjectsByKind', () => {
  it('devuelve todo con "all"', () => {
    expect(filterProjectsByKind(sample, 'all')).toHaveLength(4)
  })

  it('filtra por kind', () => {
    expect(filterProjectsByKind(sample, 'backend').map((p) => p.id)).toEqual(['a', 'd'])
  })

  it('preserva el orden original (destacados primero)', () => {
    const ids = filterProjectsByKind(projects, 'all').map((p) => p.id)
    expect(ids).toEqual(projects.map((p) => p.id))
  })

  it('devuelve array vacío si no hay coincidencias', () => {
    expect(filterProjectsByKind([make('x', 'backend')], 'frontend')).toEqual([])
  })

  it('no muta la entrada', () => {
    const input = [...sample]
    filterProjectsByKind(input, 'backend')
    expect(input).toHaveLength(4)
  })
})

describe('countProjectsByKind', () => {
  it('cuenta cada kind y el total', () => {
    expect(countProjectsByKind(sample)).toEqual({
      all: 4,
      backend: 2,
      fullstack: 1,
      frontend: 1,
    })
  })

  it('devuelve cero en los kinds sin proyectos, no undefined', () => {
    // Un contador undefined rompería el badge del filtro en la UI.
    const counts = countProjectsByKind([make('a', 'backend')])
    expect(counts.frontend).toBe(0)
    expect(counts.fullstack).toBe(0)
  })

  it('maneja la lista vacía', () => {
    expect(countProjectsByKind([])).toEqual({ all: 0, backend: 0, fullstack: 0, frontend: 0 })
  })

  it('el total coincide con la suma de los kinds en los datos reales', () => {
    const counts = countProjectsByKind(projects)
    expect(counts.backend + counts.fullstack + counts.frontend).toBe(counts.all)
  })
})

describe('buildQueryPath', () => {
  it('omite el query string con "all"', () => {
    expect(buildQueryPath('all')).toBe('/api/projects')
  })

  it('agrega el filtro como query param', () => {
    expect(buildQueryPath('backend')).toBe('/api/projects?kind=backend')
  })
})

describe('STATUS_META', () => {
  it('cubre todos los status presentes en los datos', () => {
    for (const project of projects) {
      expect(STATUS_META[project.status], project.id).toBeDefined()
    }
  })

  it('cada status tiene label y tone', () => {
    for (const [status, meta] of Object.entries(STATUS_META)) {
      expect(meta.label.length, status).toBeGreaterThan(0)
      expect(meta.tone, status).toBeTruthy()
    }
  })
})
