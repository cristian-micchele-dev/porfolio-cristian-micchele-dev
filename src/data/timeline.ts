import packgroupImg from '@/assets/images/experience/packgroup.jpg'
import fiebreFutboleraImg from '@/assets/images/experience/fiebre-futbolera.jpg'
import type { TimelineEntry } from '@/types/content'

/**
 * Experiencia como log cronológico (más reciente primero).
 * Fechas en ISO `YYYY-MM` — el formateo humano se hace en el componente.
 */
export const timeline: readonly TimelineEntry[] = [
  {
    id: 'packgroup',
    date: '2026-02',
    title: 'Optimización SEO integral',
    org: 'PackGroup',
    role: 'SEO técnico & on-page',
    description:
      '+40% de visitas orgánicas. Trabajo sobre meta tags, jerarquía de encabezados, velocidad de carga y contenido orientado a keywords del sector industrial.',
    url: 'https://www.packgroup.com.ar/',
    image: packgroupImg,
  },
  {
    id: 'fiebre-futbolera',
    date: '2025-10',
    title: 'E-commerce fotográfico',
    org: 'Fiebre Futbolera',
    role: 'Desarrollador Full Stack · freelance',
    description:
      'Tienda online desarrollada desde cero para venta de fotografía deportiva: catálogo, carrito, checkout y pasarela de pago con WooCommerce.',
    url: 'https://fiebrefutbolera.com/',
    image: fiebreFutboleraImg,
  },
] as const
