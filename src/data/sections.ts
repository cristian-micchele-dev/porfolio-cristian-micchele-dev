import type { SectionMeta } from '@/types/content'

/**
 * Fuente única del orden de secciones.
 * El SectionRail, la StatusBar y el scroll spy leen de acá — si querés reordenar
 * el sitio, se reordena este array y nada más.
 */
export const sections: readonly SectionMeta[] = [
  { id: 'identity', endpoint: 'GET /identity', title: 'Identity', navLabel: 'identity' },
  { id: 'projects', endpoint: 'GET /projects', title: 'Projects', navLabel: 'projects' },
  { id: 'stack', endpoint: 'GET /modules', title: 'System Modules', navLabel: 'stack' },
  {
    id: 'architecture',
    endpoint: 'GET /architecture',
    title: 'System Architecture',
    navLabel: 'arch',
  },
  { id: 'ai', endpoint: 'POST /ask', title: 'Ask Cristian AI', navLabel: 'ai' },
  { id: 'timeline', endpoint: 'GET /timeline', title: 'Timeline', navLabel: 'timeline' },
  { id: 'contact', endpoint: 'POST /contact', title: 'Contact', navLabel: 'contact' },
] as const

/** Las que aparecen en la nav de la status bar (identity se alcanza con el logo). */
export const navSections = sections.filter((s) => s.id !== 'identity')
