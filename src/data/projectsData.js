import Robot3D from "../assets/images/projects/robot3D.JPG";
import EchoVerse from "../assets/images/projects/ECHOVERSE.JPG";
import SitioArtesMarciales from "../assets/images/projects/sitioartesmarciales1.JPG";
import landingAnimada from "../assets/images/projects/landingAnimada.png";
import EstacionamientoApp from "../assets/images/projects/estacionamientoapp.JPG";
import Derinator from "../assets/images/projects/derinator1.JPG";
import Libreria from "../assets/images/projects/libreria.JPG";

// Proyectos Frontend
export const frontendProjects = [
  {
    id: 4,
    title: "Magic Queen - Landing Page",
    description:
      "Landing page con animaciones orquestadas y transiciones fluidas. Framer Motion para animaciones declarativas, layout responsive mobile-first y optimización de performance con lazy loading.",
    technologies: ["React", "Framer Motion", "Tailwind"],
    inProgress: false,
    demoUrl: "https://landing-juego-animada.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/landing-page-react",
    image: landingAnimada,
  },
  {
    id: 5,
    title: "Academia de Artes Marciales",
    description:
      "SPA multi-página con React Router, navegación dinámica y datos servidos desde módulos estáticos. Componentes reutilizables, CSS custom properties para theming y estructura escalable.",
    technologies: ["React", "Framer Motion", "CSS", "React Router"],
    inProgress: false,
    demoUrl: "https://artes-marciales-react.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/artes-marciales-react",
    image: SitioArtesMarciales,
  },
  {
    id: 6,
    title: "Robot 3D RenderLab",
    description:
      "Integración de escenas 3D interactivas con Spline embebido en React. Scroll animations con AOS, diseño responsive con Tailwind y optimización de carga del modelo 3D.",
    technologies: ["React", "Tailwind", "Spline", "Aos"],
    inProgress: false,
    demoUrl: "https://sitio3d-tailwind-react.onrender.com/",
    codeUrl: "https://github.com/cristian-micchele-dev/Sitio3D-tailwind-react",
    image: Robot3D,
  },
];

// Proyectos Full Stack
export const fullStackProjects = [
  {
    id: 10,
    title: "Derinator",
    description:
      "Motor de inferencia inspirado en Akinator con árbol de decisión dinámico. API REST en Express + TypeScript, PostgreSQL para persistencia de entidades y relaciones, y suite de tests con Vitest. El algoritmo descarta candidatos por probabilidad acumulada en cada ronda.",
    technologies: ["React", "Node.js", "PostgreSQL", "Express", "TypeScript", "Vitest"],
    inProgress: false,
    demoUrl: "https://derinator-frontend.vercel.app/jugar",
    codeUrl: "https://lnkd.in/dWWxsc5K",
    image: Derinator,
  },
  {
    id: 8,
    title: "Parking Admin API",
    description:
      "API REST con arquitectura hexagonal: gestión de entradas/salidas, tarifas dinámicas, tickets y turnos de caja. JWT auth con guards, documentación Swagger auto-generada y validación con class-validator.",
    technologies: ["NestJS", "TypeScript", "PostgreSQL", "TypeORM", "JWT"],
    type: "fullstack",
    inProgress: false,
    demoUrl: "https://app-estacionamiento-nest-zqkj-jet.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/app-estacionamiento-nest",
    image: EstacionamientoApp,
  },
  {
    id: 9,
    title: "EchoVerse",
    description:
      "Chat con IA generativa (Mistral) y streaming en tiempo real vía SSE. +50 personajes con 7 modos de conversación. Backend Express con prompt engineering por modo y manejo de contexto conversacional.",
    technologies: ["React", "Node.js", "Express", "Mistral AI", "Framer Motion"],
    inProgress: false,
    demoUrl: "https://echoverse-jet.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/Echoverse",
    image: EchoVerse,
  },
  {
    id: 11,
    title: "La Página Perdida",
    description:
      "Librería online full stack: Next.js 16 (App Router) + Express 5. Catálogo con Google Books API y cache en PostgreSQL para reducir llamadas externas. Auth con Supabase, validación end-to-end con Zod v4 y cobertura de tests con Vitest.",
    technologies: ["Next.js", "Express", "TypeScript", "PostgreSQL", "Supabase", "Vitest"],
    inProgress: false,
    demoUrl: "https://libreria-next-express.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/libreria-next-express",
    image: Libreria,
  },
];
