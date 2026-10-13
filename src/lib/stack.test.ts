import { describe, it, expect } from 'vitest'
import { MODULE_STATUS_META, countModules } from './stack'
import { moduleGroups } from '@/data/stack'
import type { ModuleGroup } from '@/types/content'

const sample: ModuleGroup[] = [
  {
    id: 'a',
    label: 'A',
    modules: [
      { name: 'uno', status: 'active' },
      { name: 'dos', status: 'learning' },
    ],
  },
  { id: 'b', label: 'B', modules: [{ name: 'tres', status: 'active' }] },
]

describe('countModules', () => {
  it('cuenta grupos, módulos y cada estado', () => {
    expect(countModules(sample)).toEqual({ groups: 2, modules: 3, active: 2, learning: 1 })
  })

  it('devuelve cero en los estados ausentes, no undefined', () => {
    const counts = countModules([{ id: 'a', label: 'A', modules: [{ name: 'x', status: 'active' }] }])
    expect(counts.learning).toBe(0)
  })

  it('maneja la lista vacía', () => {
    expect(countModules([])).toEqual({ groups: 0, modules: 0, active: 0, learning: 0 })
  })

  it('maneja un grupo sin módulos', () => {
    expect(countModules([{ id: 'a', label: 'A', modules: [] }])).toEqual({
      groups: 1,
      modules: 0,
      active: 0,
      learning: 0,
    })
  })

  it('active + learning cubre el total en los datos reales', () => {
    const counts = countModules(moduleGroups)
    expect(counts.active + counts.learning).toBe(counts.modules)
  })

  it('los datos reales tienen módulos para mostrar', () => {
    expect(countModules(moduleGroups).modules).toBeGreaterThan(0)
  })
})

describe('MODULE_STATUS_META', () => {
  it('cubre los dos estados posibles', () => {
    expect(Object.keys(MODULE_STATUS_META).sort()).toEqual(['active', 'learning'])
  })

  it('diferencia los estados por tono, no solo por texto', () => {
    expect(MODULE_STATUS_META.active.tone).not.toBe(MODULE_STATUS_META.learning.tone)
  })
})
