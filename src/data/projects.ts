import pulsoImg from '@/assets/images/projects/pulso.png'
import libreriaImg from '@/assets/images/projects/la-pagina-perdida.jpg'
import parkingImg from '@/assets/images/projects/parking-admin-api.jpg'
import echoverseImg from '@/assets/images/projects/echoverse.jpg'
import derinatorImg from '@/assets/images/projects/derinator.jpg'
import seishinImg from '@/assets/images/projects/seishin-dojo.jpg'
import magicQueenImg from '@/assets/images/projects/magic-queen.png'
import robot3dImg from '@/assets/images/projects/robot-3d.jpg'
import type { Project } from '@/types/content'

/**
 * Fuente única de proyectos.
 * La sección Projects, el comando `/projects` de la terminal y la base de
 * conocimiento del agente leen de acá. Si divergen, hay un bug.
 *
 * `featured: true` → abre la grilla. Ordenados de mayor a menor peso backend.
 */
export const projects: readonly Project[] = [
  {
    id: 'pulso',
    name: 'Pulso — Gestión Hospitalaria',
    kind: 'fullstack',
    summary:
      'Sistema interno de gestión hospitalaria: médicos, pacientes, turnos, historia clínica y mensajería en tiempo real. El dominio está aislado de NestJS y de TypeORM, así que la lógica de negocio no sabe que existe un framework.',
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'React', 'TanStack Query', 'Socket.IO'],
    architecture: 'Hexagonal · domain → application → adapters',
    status: 'production',
    deployment: 'Vercel',
    highlights: [
      'JWT con refresh rotativo y cookies httpOnly',
      'Protección CSRF y rate limiting por IP',
      'Hashing con Argon2',
      'RBAC con permisos granulares sobre la historia clínica',
      'Auditoría de accesos a datos sensibles',
      'Mensajería en tiempo real con Socket.IO',
    ],
    demoUrl: 'https://pulso-six-mauve.vercel.app/login',
    repoUrl: 'https://github.com/cristian-micchele-dev/Pulso',
    image: pulsoImg,
    featured: true,
  },
  {
    id: 'la-pagina-perdida',
    name: 'La Página Perdida',
    kind: 'fullstack',
    summary:
      'Librería online full stack. El catálogo consume Google Books API con una capa de cache en PostgreSQL que recorta drásticamente las llamadas externas. Validación end-to-end con Zod y cobertura de tests en Vitest.',
    stack: ['Next.js', 'Express', 'TypeScript', 'PostgreSQL', 'Supabase', 'Zod', 'Vitest'],
    architecture: 'API en capas + cache-aside sobre PostgreSQL',
    status: 'production',
    deployment: 'Vercel',
    highlights: [
      'Cache-aside sobre Google Books API',
      'Auth gestionada con Supabase',
      'Contratos validados con Zod v4 en cliente y servidor',
      'Next.js 16 App Router + Express 5',
    ],
    demoUrl: 'https://libreria-next-express.vercel.app/',
    repoUrl: 'https://github.com/cristian-micchele-dev/libreria-next-express',
    image: libreriaImg,
    featured: true,
  },
  {
    id: 'parking-admin-api',
    name: 'Parking Admin API',
    kind: 'backend',
    summary:
      'API REST para administración de playas de estacionamiento: entradas y salidas, tarifas dinámicas, emisión de tickets y cierre de turnos de caja. Documentación Swagger generada desde los decoradores.',
    stack: ['NestJS', 'TypeScript', 'PostgreSQL', 'TypeORM', 'JWT', 'Swagger'],
    architecture: 'Hexagonal · puertos y adaptadores',
    status: 'production',
    deployment: 'Vercel',
    highlights: [
      'Guards de autenticación por rol',
      'Cálculo de tarifas dinámicas por franja horaria',
      'Validación con class-validator en el borde',
      'OpenAPI auto-generada',
    ],
    demoUrl: 'https://app-estacionamiento-nest-zqkj-jet.vercel.app/',
    repoUrl: 'https://github.com/cristian-micchele-dev/app-estacionamiento-nest',
    image: parkingImg,
    featured: true,
  },
  {
    id: 'echoverse',
    name: 'EchoVerse',
    kind: 'fullstack',
    summary:
      'Chat con IA generativa y streaming token a token vía Server-Sent Events. Más de 50 personajes con 7 modos de conversación, cada uno con su propio prompt engineering y manejo de ventana de contexto.',
    stack: ['React', 'Node.js', 'Express', 'Mistral AI', 'SSE', 'Framer Motion'],
    architecture: 'Streaming SSE + capa de prompts por modo',
    status: 'production',
    deployment: 'Vercel',
    highlights: [
      'Streaming en tiempo real con Server-Sent Events',
      'Prompt engineering por modo de conversación',
      'Gestión de contexto conversacional con ventana acotada',
      'API key nunca expuesta al cliente',
    ],
    demoUrl: 'https://echoverse-jet.vercel.app/',
    repoUrl: 'https://github.com/cristian-micchele-dev/Echoverse',
    image: echoverseImg,
    featured: true,
  },
  {
    id: 'derinator',
    name: 'Derinator',
    kind: 'fullstack',
    summary:
      'Motor de inferencia inspirado en Akinator. El algoritmo mantiene probabilidades acumuladas por candidato y descarta ramas del árbol de decisión en cada ronda. API REST en Express con tests sobre el motor.',
    stack: ['Express', 'TypeScript', 'PostgreSQL', 'React', 'Vitest'],
    architecture: 'Motor de inferencia desacoplado de la capa HTTP',
    status: 'production',
    deployment: 'Vercel',
    highlights: [
      'Árbol de decisión dinámico con probabilidad acumulada',
      'Persistencia de entidades y relaciones en PostgreSQL',
      'Motor testeado en aislamiento con Vitest',
    ],
    demoUrl: 'https://derinator-frontend.vercel.app/jugar',
    repoUrl: 'https://github.com/cristian-micchele-dev/Derinator',
    image: derinatorImg,
    featured: true,
  },
  {
    id: 'seishin-dojo',
    name: 'Seishin Dojo',
    kind: 'frontend',
    summary:
      'Sitio para una academia de artes marciales. SPA multi-vista con React Router, contenido servido desde módulos estáticos y theming con CSS custom properties.',
    stack: ['React', 'Vite', 'React Router'],
    status: 'live',
    deployment: 'Vercel',
    demoUrl: 'https://artes-marciales-react.vercel.app/',
    repoUrl: 'https://github.com/cristian-micchele-dev/artes-marciales-react',
    image: seishinImg,
    featured: false,
  },
  {
    id: 'magic-queen',
    name: 'Magic Queen — Landing',
    kind: 'frontend',
    summary:
      'Landing con animaciones orquestadas y transiciones encadenadas en Framer Motion. Mobile-first con lazy loading de los assets pesados.',
    stack: ['React', 'Framer Motion', 'Tailwind CSS'],
    status: 'live',
    deployment: 'Netlify',
    demoUrl: 'https://landing-juego-animada.netlify.app/',
    repoUrl: 'https://github.com/cristian-micchele-dev/landing-page-react',
    image: magicQueenImg,
    featured: false,
  },
  {
    id: 'robot-3d',
    name: 'Robot 3D RenderLab',
    kind: 'frontend',
    summary:
      'Integración de una escena 3D interactiva de Spline dentro de React, con carga diferida del modelo para no bloquear el primer render.',
    stack: ['React', 'Tailwind CSS', 'Spline'],
    status: 'live',
    deployment: 'Render',
    demoUrl: 'https://sitio3d-tailwind-react.onrender.com/',
    repoUrl: 'https://github.com/cristian-micchele-dev/Sitio3D-tailwind-react',
    image: robot3dImg,
    featured: false,
  },
] as const

export const featuredProjects = projects.filter((p) => p.featured)

export function findProject(id: string): Project | undefined {
  return projects.find((p) => p.id === id)
}
