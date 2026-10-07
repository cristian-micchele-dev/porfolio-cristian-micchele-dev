import type { DotTone } from '@/components/primitives/StatusDot'
import type { ModuleGroup, ModuleStatus } from '@/types/content'

export const MODULE_STATUS_META: Record<ModuleStatus, { label: string; tone: DotTone }> = {
  active: { label: 'active', tone: 'ok' },
  learning: { label: 'learning', tone: 'warn' },
}

export interface ModuleCounts {
  groups: number
  modules: number
  active: number
  learning: number
}

/**
 * Conteos para el ResponseBlock de la sección.
 * Las cuatro claves arrancan en cero para que el cuerpo JSON nunca muestre
 * `undefined` cuando un estado no está presente en los datos.
 */
export function countModules(groups: readonly ModuleGroup[]): ModuleCounts {
  const counts: ModuleCounts = { groups: groups.length, modules: 0, active: 0, learning: 0 }

  for (const group of groups) {
    for (const tech of group.modules) {
      counts.modules += 1
      counts[tech.status] += 1
    }
  }

  return counts
}
