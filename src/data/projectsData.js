import DragonBallZ from "../assets/images/projects/dRAGONBALLZ.png";

import ArtesMarciales from "../assets/images/projects/Artesmarciales.png";
import SocketChat from "../assets/images/projects/socketChat.JPG";
import Robot3D from "../assets/images/projects/robot3D.JPG";
import EchoVerse from "../assets/images/projects/ECHOVERSE.JPG";
import SitioArtesMarciales from "../assets/images/projects/sitioartesmarciales1.JPG";

import landingAnimada from "../assets/images/projects/landingAnimada.png";
import Login from "../assets/images/projects/Login.JPG";
import EstacionamientoApp from "../assets/images/projects/estacionamientoapp.JPG";
import Derinator from "../assets/images/projects/derinator1.JPG";

// Proyectos básicos
export const backendProjects = [
  {
    id: 1,
    title: "Api Dragon ball Z con Nest",
    description:
      "Api de dragon ball z con NestJs utilizando MONGODB y fronted básico para consumirlo.",
    technologies: ["HTML", "CSS", "Nest", "MongoDB"],
    inProgress: false,
    demoUrl: "https://tubular-eclair-4fae91.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/nest-api-dragonballz",
    image: DragonBallZ,
  },
  {
    id: 2,
    title: "Api de Artes Marciales",
    description:
      "Este proyecto utiliza fetch para consumir y mostrar datos desde mi propia API de artes marciales, incluyendo detalles como nombre, origen y filosofía de cada arte..",
    technologies: ["HTML", "CSS", "Express", "MongoDB"],
    inProgress: false,
    demoUrl: "https://artesmarcialesf.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/martialArts-Api-mongo",
    image: ArtesMarciales,
  },
  {
    id: 3,
    title: "WebSocket",
    description:
      "WebSocket con roles y autenticacion JWT con una base de datos typeORM robusta de Usuarios.",
    technologies: ["Nest", "PostgresSQL", "Socket.io", "TypeORM"],
    inProgress: false,
    demoUrl: "#",
    codeUrl: "https://github.com/cristian-micchele-dev/tesloshop-nest",
    image: SocketChat,
  },
];

// Proyectos Frontend
export const frontendProjects = [
  {
    id: 4,
    title: "Magic Queen - Landing Page",
    description:
      "Magic Quest es un juego de aventuras y fantasía en el que encarnás a Lyra, una poderosa hechicera de energía astral que despierta en un mundo olvidado, sumido en sombras y caos.",
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
      "Sitio web de una academia de artes marciales, con información sobre los diferentes tipos de artes marciales, sus beneficios y cómo contactar con la academia.",
    technologies: ["React", "Framer Motion", "CSS", "React Router"],
    inProgress: false, // ← Cambiar de true a false
    demoUrl: "https://artes-marciales-react.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/artes-marciales-react",
    image: SitioArtesMarciales,
  },
  {
    id: 6,
    title: "Robot 3D RenderLab",
    description:
      "Sitio web interactivo para renderizar y personalizar robots 3D en tiempo real. Utiliza React, Tailwind CSS, Spline y AOS para una experiencia de usuario dinámica y atractiva.",
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
      "Nació Derinator: un juego inspirado en Akinator, con el rostro de mi hijo como protagonista. No quería hacer un simple juego de preguntas y respuestas — quería construir un verdadero motor de inferencia. Lo que empezó como algo divertido terminó siendo uno de los desafíos técnicos más interesantes que desarrollé.",
    technologies: ["React", "Node.js", "PostgreSQL", "Express", "TypeScript", "Vitest"],
    inProgress: false,
    demoUrl: "https://lnkd.in/de6eKUtZ",
    codeUrl: "https://lnkd.in/dWWxsc5K",
    image: Derinator,
  },
  {
    id: 8,
    title: "Parking Admin API",
    description:
      "Sistema de administración de estacionamientos: gestión de entradas/salidas, tarifas, tickets, pagos y turnos de caja. Backend REST con arquitectura hexagonal, JWT auth y Swagger.",
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
      "App para chatear con personajes ficticios icónicos usando IA generativa. Más de 50 personajes con 7 modos: Interrogatorio, Confesionario, Misión RPG, Dilema y más. Streaming en tiempo real con SSE.",
    technologies: ["React", "Node.js", "Express", "Mistral AI", "Framer Motion"],
    inProgress: false,
    demoUrl: "https://echoverse-jet.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/Echoverse",
    image: EchoVerse,
  },
];
