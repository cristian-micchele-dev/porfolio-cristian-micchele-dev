import type {
  ArchitectureConcept,
  ArchitectureLayer,
  CaseStudy,
  ModuleGroup,
  Project,
} from '@/types/content'

/**
 * Serialización para los endpoints públicos.
 *
 * Existe por dos razones:
 *
 * 1. `image` es un `StaticImageData` con `blurDataURL`, `blurWidth` y demás
 *    internals del bundler. Volcarlo crudo filtra detalles de build que no le
 *    sirven a nadie y atan la respuesta a Next.
 * 2. La forma de la respuesta es un contrato. Definirla una vez acá —y no
 *    inline en cada route handler— es lo que permite testearla.
 */

export interface ProjectPayload {
  id: string
  name: string
  kind: Project['kind']
  summary: string
  stack: string[]
  architecture: string | null
  status: Project['status']
  deployment: string
  highlights: string[]
  links: { demo: string | null; repo: string | null }
  image: string
  featured: boolean
  self: string
}

export function serializeProject(project: Project): ProjectPayload {
  return {
    id: project.id,
    name: project.name,
    kind: project.kind,
    summary: project.summary,
    stack: [...project.stack],
    // `null` explícito y no campo ausente: un consumidor no debería tener que
    // distinguir "no aplica" de "me olvidé de mandarlo".
    architecture: project.architecture ?? null,
    status: project.status,
    deployment: project.deployment,
    highlights: [...(project.highlights ?? [])],
    links: { demo: project.demoUrl ?? null, repo: project.repoUrl ?? null },
    image: project.image.src,
    featured: project.featured,
    self: `/api/projects/${project.id}`,
  }
}

export interface CasePayload {
  headline: string
  problem: string
  decisions: CaseStudy['decisions']
  scope: CaseStudy['scope']
}

export function serializeCase(study: CaseStudy): CasePayload {
  return {
    headline: study.headline,
    problem: study.problem,
    decisions: study.decisions.map((d) => ({ ...d })),
    scope: study.scope.map((s) => ({ ...s })),
  }
}

export interface ModuleGroupPayload {
  id: string
  label: string
  modules: Array<{ name: string; status: string }>
}

export function serializeModuleGroup(group: ModuleGroup): ModuleGroupPayload {
  return {
    id: group.id,
    label: group.label,
    modules: group.modules.map((m) => ({ name: m.name, status: m.status })),
  }
}

export interface LayerPayload {
  id: string
  name: string
  description: string
  examples: string[]
  /** 0 = núcleo. Explícito, porque el orden de un array JSON no comunica intención. */
  depth: number
}

export function serializeLayer(layer: ArchitectureLayer, index: number): LayerPayload {
  return {
    id: layer.id,
    name: layer.name,
    description: layer.description,
    examples: [...layer.examples],
    depth: index,
  }
}

export function serializeConcept(concept: ArchitectureConcept): ArchitectureConcept {
  return { name: concept.name, description: concept.description }
}
