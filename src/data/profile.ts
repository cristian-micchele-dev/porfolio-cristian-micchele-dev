import photo from '@/assets/images/cristian-micchele.png'
import type { Profile } from '@/types/content'

export const profile: Profile = {
  name: 'Cristian Micchele',
  role: 'Full Stack Developer',
  specialization: 'Backend Specialized',
  availability: 'available',
  location: 'Argentina',
  summary:
    'Construyo aplicaciones web centradas en arquitecturas mantenibles, APIs robustas y experiencias modernas.',
  email: 'c.micchele@gmail.com',
  github: 'https://github.com/cristian-micchele-dev',
  linkedin: 'https://www.linkedin.com/in/cristian-micchele-1445a92b5/',
  sourceRepo: 'https://github.com/cristian-micchele-dev/porfolio-cristian-micchele-dev',
  photo,

  /**
   * CV descargable.
   *
   * ⚠️ Sin definir a propósito: mientras no exista el archivo, el botón y el
   * comando `/cv` NO se renderizan. Publicar un link que da 404 es el mismo
   * error que los endpoints dibujados que ya corregimos (DESIGN.md §8).
   *
   * Para activarlo: poné el PDF en `public/cv/cristian-micchele.pdf` y
   * descomentá la línea de abajo. Nada más.
   */
  // cvUrl: '/cv/cristian-micchele.pdf',
}
