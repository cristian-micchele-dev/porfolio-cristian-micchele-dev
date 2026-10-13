import type { StaticImageData } from 'next/image'

/** Secciones del sitio. El orden de este array define el orden del rail y del scroll. */
export const SECTION_IDS = [
  'identity',
  'about',
  'projects',
  'stack',
  'ai',
  'contact',
] as const

export type SectionId = (typeof SECTION_IDS)[number]

export interface SectionMeta {
  id: SectionId
  /** Prefijo mono que encabeza la sección: `GET /projects`. DESIGN.md §4 */
  endpoint: string
  /** Título en Inter. */
  title: string
  /** Etiqueta corta para la status bar y el rail. */
  navLabel: string
}

/* -------------------------------------------------------------------------- */
/*                                  PERFIL                                    */
/* -------------------------------------------------------------------------- */

export interface Profile {
  name: string
  role: string
  specialization: string
  availability: 'available' | 'open' | 'unavailable'
  location: string
  /** Blurb del hero: 2 líneas, nada más. */
  summary: string
  email: string
  github: string
  linkedin: string
  /** Repo de este mismo portfolio — lo expone el comando `/source`. */
  sourceRepo: string
  photo: StaticImageData
  /**
   * CV descargable. Opcional: sin archivo, el botón y el comando `/cv` no se
   * renderizan. Nunca se publica un link que no resuelve.
   */
  cvUrl?: string
}

/* -------------------------------------------------------------------------- */
/*                                 PROYECTOS                                  */
/* -------------------------------------------------------------------------- */

export type ProjectStatus = 'production' | 'live' | 'wip'

export type ProjectKind = 'backend' | 'frontend' | 'fullstack'

export interface Project {
  /** Slug estable. Se usa en URLs, en el comando `/projects` y como key de React. */
  id: string
  name: string
  kind: ProjectKind
  /** Prosa en español, 1-3 oraciones. */
  summary: string
  stack: string[]
  /** Patrón arquitectónico. Si no aplica, se omite el campo (no se muestra vacío). */
  architecture?: string
  status: ProjectStatus
  deployment: string
  /** Bullets técnicos cortos para el panel de detalle. */
  highlights?: string[]
  demoUrl?: string
  repoUrl?: string
  image: StaticImageData
  /** Los destacados abren la grilla de Projects. */
  featured: boolean
}

/* -------------------------------------------------------------------------- */
/*                               STACK / MÓDULOS                              */
/* -------------------------------------------------------------------------- */

/** Sin porcentajes. Nunca. El brief lo pide explícitamente. */
export type ModuleStatus = 'active' | 'learning'

export interface TechModule {
  name: string
  status: ModuleStatus
}

export interface ModuleGroup {
  id: string
  /** Label del grupo, en mono uppercase. */
  label: string
  modules: TechModule[]
}

/* -------------------------------------------------------------------------- */
/*                                ARQUITECTURA                                */
/* -------------------------------------------------------------------------- */

export interface ArchitectureLayer {
  id: string
  name: string
  /** Qué vive en esta capa. */
  description: string
  /** Ejemplos concretos del stack real. */
  examples: string[]
}

export interface ArchitectureConcept {
  name: string
  description: string
}

/* -------------------------------------------------------------------------- */
/*                               CASO DESTACADO                               */
/* -------------------------------------------------------------------------- */

export interface CaseDecision {
  title: string
  /** Por qué se tomó. */
  rationale: string
  /**
   * Qué costó. OBLIGATORIO a propósito.
   *
   * Una decisión sin su costo declarado es marketing. Este campo es lo que
   * separa "usé arquitectura hexagonal" de "sé cuándo NO usarla", y es
   * exactamente lo que un tech lead está buscando leer.
   */
  tradeoff: string
}

export interface CaseStudy {
  /** Slug del proyecto en `projects.ts`. El caso no duplica sus datos. */
  projectId: string
  headline: string
  problem: string
  decisions: CaseDecision[]
  /** Alcance del dominio, como pares label → valor. */
  scope: Array<{ label: string; value: string }>
}

/* -------------------------------------------------------------------------- */
/*                             TRABAJO CON CLIENTES                           */
/* -------------------------------------------------------------------------- */

export interface ClientWork {
  id: string
  /** ISO corto `YYYY-MM` — se formatea en el componente, no en los datos. */
  date: string
  title: string
  org: string
  role: string
  description: string
  url?: string
  image?: StaticImageData
}

/* -------------------------------------------------------------------------- */
/*                               CERTIFICACIONES                              */
/* -------------------------------------------------------------------------- */

export interface Certificate {
  id: string
  title: string
  issuer: string
  year: string
  category: string
  skills: string[]
  credentialUrl: string
  image: StaticImageData
}
