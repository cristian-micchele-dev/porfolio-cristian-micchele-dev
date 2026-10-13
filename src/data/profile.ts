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
   * CV descargable. El archivo vive en `public/cv/`.
   *
   * Si alguna vez se saca el PDF, hay que vaciar este campo: el botón, el
   * panel de Contact y el comando `/cv` se apagan solos, y así nunca queda
   * un link publicado que dé 404 (DESIGN.md §8).
   */
  cvUrl: '/cv/cristian-micchele.pdf',
}
