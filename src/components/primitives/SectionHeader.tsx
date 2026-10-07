import { Reveal } from './Reveal'

interface SectionHeaderProps {
  /** `GET /projects` — mono 11px, accent. */
  endpoint: string
  /** `Projects` — Inter grande, fg. */
  title: string
  /** Una o dos líneas de contexto. Opcional. */
  description?: string
}

/**
 * La firma tipográfica del sitio. DESIGN.md §4.
 *
 * El contraste mono/sans entre endpoint y título ES la identidad visual —
 * se repite idéntico en las 7 secciones. No lo variemos por sección.
 */
export function SectionHeader({ endpoint, title, description }: SectionHeaderProps) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="label-mono mb-3 text-accent">{endpoint}</p>
      <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight text-fg">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-[58ch] text-fg-muted">{description}</p>
      )}
    </Reveal>
  )
}
