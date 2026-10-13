import packgroupImg from '@/assets/images/experience/packgroup.jpg'
import fiebreFutboleraImg from '@/assets/images/experience/fiebre-futbolera.jpg'
import type { ClientWork } from '@/types/content'

/**
 * Trabajo freelance con clientes reales, más reciente primero.
 *
 * Ya no es una sección: vive como un panel compacto al final de Projects.
 * La señal que importa es "trabajó con clientes que pagaron", y eso se
 * transmite en tres líneas — una sección entera para dos entradas, una de
 * ellas de SEO, diluía el posicionamiento backend en lugar de reforzarlo.
 *
 * Fechas en ISO `YYYY-MM`; el formateo vive en el componente.
 */
export const clientWork: readonly ClientWork[] = [
  {
    id: 'packgroup',
    date: '2026-02',
    title: 'Optimización SEO integral',
    org: 'PackGroup',
    role: 'SEO técnico & on-page · freelance',
    description:
      '+40% de visitas orgánicas. Meta tags, jerarquía de encabezados, velocidad de carga y contenido orientado a keywords del sector industrial.',
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
      'Tienda online desde cero para venta de fotografía deportiva: catálogo, carrito, checkout y pasarela de pago con WooCommerce.',
    url: 'https://fiebrefutbolera.com/',
    image: fiebreFutboleraImg,
  },
] as const
