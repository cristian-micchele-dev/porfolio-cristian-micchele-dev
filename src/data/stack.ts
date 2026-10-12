import type { ModuleGroup } from '@/types/content'

/**
 * SYSTEM MODULES.
 * Sin porcentajes — el brief lo prohíbe explícitamente y con razón: "Node.js 90%"
 * no significa nada. `active` = lo uso en producción. `learning` = lo estoy incorporando.
 */
export const moduleGroups: readonly ModuleGroup[] = [
  {
    id: 'backend',
    label: 'Backend',
    modules: [
      { name: 'Node.js', status: 'active' },
      { name: 'NestJS', status: 'active' },
      { name: 'Express', status: 'active' },
      { name: 'TypeScript', status: 'active' },
      { name: 'TypeORM', status: 'active' },
      { name: 'Socket.IO', status: 'active' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    modules: [
      { name: 'PostgreSQL', status: 'active' },
      { name: 'MongoDB', status: 'active' },
      { name: 'MySQL', status: 'active' },
      { name: 'Supabase', status: 'active' },
      { name: 'Redis', status: 'learning' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    modules: [
      { name: 'React', status: 'active' },
      { name: 'Next.js', status: 'active' },
      { name: 'Tailwind CSS', status: 'active' },
      { name: 'TanStack Query', status: 'active' },
      { name: 'Framer Motion', status: 'active' },
    ],
  },
  {
    id: 'quality',
    label: 'Testing & Quality',
    modules: [
      { name: 'Vitest', status: 'active' },
      { name: 'Zod', status: 'active' },
      { name: 'Swagger / OpenAPI', status: 'active' },
      { name: 'Jest', status: 'active' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    modules: [
      { name: 'Docker', status: 'active' },
      { name: 'Vercel', status: 'active' },
      { name: 'Render', status: 'active' },
      { name: 'GitHub Actions', status: 'active' },
    ],
  },
] as const

/** Nombres planos de todos los módulos — lo usa el comando `/stack` y el agente. */
export const allModuleNames = moduleGroups.flatMap((g) => g.modules.map((m) => m.name))
