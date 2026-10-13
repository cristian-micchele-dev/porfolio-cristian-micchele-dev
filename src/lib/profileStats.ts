import { projects } from '@/data/projects'
import { clientWork } from '@/data/clients'

export interface ProfileStat {
  label: string
  value: number
}

/**
 * Los números que permiten calibrar el perfil, derivados de los datos.
 *
 * Deliberadamente NO incluye años de experiencia ni seniority: no están en
 * los datos y no se inventan. Tampoco "proyectos en producción", aunque el
 * campo `status` lo diga — para un reclutador "producción" sugiere usuarios
 * reales, y lo único verificable acá es que hay un deploy público.
 *
 * Cada número lo puede comprobar cualquiera haciendo click.
 */
export function profileStats(): ProfileStat[] {
  return [
    { label: 'demos públicas', value: projects.filter((p) => p.demoUrl).length },
    { label: 'repos abiertos', value: projects.filter((p) => p.repoUrl).length },
    { label: 'clientes freelance', value: clientWork.length },
  ].filter((stat) => stat.value > 0)
}
