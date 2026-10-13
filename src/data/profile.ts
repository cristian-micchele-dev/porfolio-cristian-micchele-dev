import photo from '@/assets/images/cristian-micchele.png'
import type { Profile } from '@/types/content'

export const profile: Profile = {
  name: 'Cristian Micchele',
  role: 'Full Stack Developer',
  specialization: 'Backend Specialized',
  availability: 'available',
  location: 'Argentina',
  /**
   * Lo primero que lee un visitante.
   *
   * Es tu propia frase del CV, comprimida: "construir productos completos, no
   * solo tareas". La anterior —"arquitecturas mantenibles, APIs robustas y
   * experiencias modernas"— la podía firmar cualquiera.
   *
   * Un blurb sirve cuando alguien podría estar en desacuerdo con él. Si nadie
   * puede discutirlo, no dice nada.
   */
  summary:
    'Construyo productos completos, no tareas sueltas. Diseño el backend de punta a punta: APIs, modelo de datos y control de acceso.',
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
