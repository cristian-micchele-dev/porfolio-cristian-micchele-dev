import { describe, it, expect } from 'vitest'
import { profileStats } from './profileStats'
import { projects } from '@/data/projects'
import { clientWork } from '@/data/clients'

describe('profileStats', () => {
  const stats = profileStats()
  const get = (label: string) => stats.find((s) => s.label === label)

  it('cuenta las demos que realmente tienen URL', () => {
    expect(get('demos públicas')?.value).toBe(projects.filter((p) => p.demoUrl).length)
  })

  it('cuenta los repos que realmente tienen URL', () => {
    expect(get('repos abiertos')?.value).toBe(projects.filter((p) => p.repoUrl).length)
  })

  it('cuenta los clientes reales', () => {
    expect(get('clientes freelance')?.value).toBe(clientWork.length)
  })

  it('cada número es verificable con un click', () => {
    // La regla del sitio: no se muestra lo que no se puede comprobar.
    // Un visitante puede abrir cada demo y cada repo.
    for (const stat of stats) {
      expect(stat.value, stat.label).toBeGreaterThan(0)
    }
  })

  it('NO declara años de experiencia ni seniority', () => {
    // No están en los datos. Inventarlos sería exactamente lo que el resto
    // del sitio evita.
    const labels = stats.map((s) => s.label).join(' ')
    expect(labels).not.toMatch(/años|year|senior|junior|semi/i)
  })

  it('NO habla de "producción": lo verificable es que hay deploy', () => {
    // El campo `status` dice production, pero para un reclutador eso sugiere
    // usuarios reales. "Demo pública" es lo que cualquiera puede comprobar.
    expect(stats.map((s) => s.label).join(' ')).not.toMatch(/produccion|production/i)
  })

  it('omite las métricas en cero en lugar de mostrar un 0', () => {
    for (const stat of stats) {
      expect(stat.value).not.toBe(0)
    }
  })
})
