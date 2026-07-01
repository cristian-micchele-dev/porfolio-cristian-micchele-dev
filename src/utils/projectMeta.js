// Clasificación automática de proyectos por tipo según sus tecnologías.
// Extraída de ProjectCard.jsx para permitir testing aislado — esta lógica
// tiene 4 branches y es la que define el badge visible de cada card.

export const BACKEND_TECHS = new Set([
  'Node.js', 'MongoDB', 'Express', 'Nest', 'NestJS', 'PostgreSQL', 'MySQL',
])

export const FRONTEND_TECHS = new Set(['React', 'Vue', 'Angular', 'Tailwind'])

/**
 * Devuelve { type, label } según el subset de tecnologiasBackend/Frontend.
 *   - tiene ambas     → 'fullstack' | 'Full Stack'
 *   - solo frontend   → 'frontend'  | 'Frontend'
 *   - solo backend    → 'backend'   | 'Backend'
 *   - ninguna         → 'basic'     | 'Básico'
 * @param {string[]} technologies
 */
export function getProjectMeta(technologies) {
  const hasBackend = technologies.some(t => BACKEND_TECHS.has(t))
  const hasFrontend = technologies.some(t => FRONTEND_TECHS.has(t))

  if (hasBackend && hasFrontend) return { type: 'fullstack', label: 'Full Stack' }
  if (hasFrontend)               return { type: 'frontend',  label: 'Frontend' }
  if (hasBackend)                return { type: 'backend',   label: 'Backend' }
  return                                { type: 'basic',     label: 'Básico' }
}