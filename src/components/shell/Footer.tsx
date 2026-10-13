import { profile } from '@/data/profile'

/**
 * El cierre del sitio. Dos líneas y nada más.
 *
 * Antes era un stream de logs con el health check, el runtime y los cambios
 * de sección. Los eventos eran reales —no inventados— pero hablaban del
 * sitio, no de Cristian, y el pie de página no es lugar para telemetría.
 *
 * Al no leer estado, dejó de necesitar `'use client'`: es un server component.
 */
export function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <p className="font-mono text-sm text-fg">
          cristian<span className="text-fg-faint">.dev</span>
        </p>
        <p className="mt-1 text-[15px] text-fg-muted">
          {profile.name} — {profile.role}, {profile.specialization}
        </p>
      </div>
    </footer>
  )
}
