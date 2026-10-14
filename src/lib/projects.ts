import type { DotTone } from '@/types/ui'
import type { Project, ProjectKind, ProjectStatus } from '@/types/content'

export type KindFilter = 'all' | ProjectKind

/** El orden es el de los botones de filtro. `all` primero: es el default. */
export const KIND_FILTERS: readonly KindFilter[] = ['all', 'backend', 'fullstack', 'frontend']

export const KIND_LABEL: Record<KindFilter, string> = {
  all: 'all',
  backend: 'backend',
  fullstack: 'fullstack',
  frontend: 'frontend',
}

export const STATUS_META: Record<ProjectStatus, { label: string; tone: DotTone }> = {
  production: { label: 'production', tone: 'ok' },
  live: { label: 'live', tone: 'ok' },
  wip: { label: 'wip', tone: 'warn' },
}

export function filterProjectsByKind(
  projects: readonly Project[],
  kind: KindFilter,
): readonly Project[] {
  if (kind === 'all') return projects
  return projects.filter((p) => p.kind === kind)
}

/**
 * Contadores por kind, siempre con las cuatro claves presentes.
 * Un contador `undefined` rompería el badge del filtro, así que se inicializa
 * en cero en lugar de acumular sobre un objeto vacío.
 */
export function countProjectsByKind(projects: readonly Project[]): Record<KindFilter, number> {
  const counts: Record<KindFilter, number> = { all: 0, backend: 0, fullstack: 0, frontend: 0 }

  for (const project of projects) {
    counts.all += 1
    counts[project.kind] += 1
  }

  return counts
}

/**
 * El path que muestra el ResponseBlock.
 * El filtro no es un tab decorativo: cambia la request que se exhibe, así la
 * metáfora de API funciona en lugar de solo ilustrar.
 */
export function buildQueryPath(kind: KindFilter): string {
  return kind === 'all' ? '/api/projects' : `/api/projects?kind=${kind}`
}
