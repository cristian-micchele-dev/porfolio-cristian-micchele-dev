import { describe, it, expect } from 'vitest'
import { getProjectMeta, BACKEND_TECHS, FRONTEND_TECHS } from './projectMeta'

describe('getProjectMeta', () => {
  it('devuelve "fullstack" cuando hay techs de backend y frontend', () => {
    const result = getProjectMeta(['Node.js', 'MongoDB', 'React'])
    expect(result).toEqual({ type: 'fullstack', label: 'Full Stack' })
  })

  it('devuelve "frontend" cuando solo hay techs frontend', () => {
    const result = getProjectMeta(['React', 'Tailwind', 'Axios'])
    expect(result).toEqual({ type: 'frontend', label: 'Frontend' })
  })

  it('devuelve "backend" cuando solo hay techs backend', () => {
    const result = getProjectMeta(['NestJS', 'PostgreSQL', 'Docker'])
    expect(result).toEqual({ type: 'backend', label: 'Backend' })
  })

  it('devuelve "basic" cuando no hay techs reconocidas', () => {
    const result = getProjectMeta(['Docker', 'Git', 'Linux'])
    expect(result).toEqual({ type: 'basic', label: 'Básico' })
  })

  it('devuelve "basic" cuando el array está vacío', () => {
    const result = getProjectMeta([])
    expect(result).toEqual({ type: 'basic', label: 'Básico' })
  })

  it('no muta el array de tecnologías recibido', () => {
    const techs = ['Node.js', 'React']
    getProjectMeta(techs)
    expect(techs).toEqual(['Node.js', 'React'])
  })

  it('reconoce "Nest" como alias corto de NestJS (backend)', () => {
    expect(getProjectMeta(['Nest', 'Vue']).type).toBe('fullstack')
  })

  it('los Sets no se filtran entre sí', () => {
    // Sanity: backend y frontend no comparten tecnologías
    const allBackend = Array.from(BACKEND_TECHS)
    const allFrontend = Array.from(FRONTEND_TECHS)
    const overlap = allBackend.filter(t => allFrontend.includes(t))
    expect(overlap).toEqual([])
  })
})