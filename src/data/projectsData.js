import DragonBallZ from "../assets/images/projects/dRAGONBALLZ.png"

import ArtesMarciales from "../assets/images/projects/Artesmarciales.png"
import SocketChat from "../assets/images/projects/socketChat.JPG"
import PlantsShop from "../assets/images/projects/plantsShop1.JPG"
import ProximamenteImage from "../assets/images/projects/proximamente.avif"
import SitioArtesMarciales from "../assets/images/projects/sitioartesmarciales1.JPG"

import landingAnimada from "../assets/images/projects/landingAnimada.png"
import SeñorDeLosAnillos from "../assets/images/projects/SeñorDeLosAnillos.JPG"
import Login from "../assets/images/projects/Login.JPG"
import FiebreFutbolera from "../assets/images/projects/FiebreFutboleraEcommerce.JPG"







// Proyectos básicos
export const backendProjects = [
  {
    id: 1,
    title: "Api Dragon ball Z con Nest",
    description: "Api de dragon ball z con NestJs utilizando MONGODB y fronted básico para consumirlo.",
    technologies: ["HTML", "CSS", "Nest", "MongoDB"],
    inProgress: false,
    demoUrl: "https://tubular-eclair-4fae91.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/nest-api-dragonballz",
    image: DragonBallZ,

  },
  {
    id: 2,
    title: "Api de Artes Marciales",
    description: "Este proyecto utiliza fetch para consumir y mostrar datos desde mi propia API de artes marciales, incluyendo detalles como nombre, origen y filosofía de cada arte..",
    technologies: ["HTML", "CSS", "Express", "MongoDB"],
    inProgress: false,
    demoUrl: "https://artesmarcialesf.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/martialArts-Api-mongo",
    image: ArtesMarciales,

  },
  {
    id: 3,
    title: "WebSocket",
    description: "WebSocket con roles y autenticacion JWT con una base de datos typeORM robusta de Usuarios.",
    technologies: ["Nest", "PostgresSQL", "Socket.io", "TypeORM"],
    inProgress: false,
    demoUrl: "#",
    codeUrl: "https://github.com/cristian-micchele-dev/tesloshop-nest",
    image: SocketChat,

  }
]

// Proyectos Frontend
export const frontendProjects = [
  {
    id: 4,
    title: "Magic Queen - Landing Page",
    description: "Magic Quest es un juego de aventuras y fantasía en el que encarnás a Lyra, una poderosa hechicera de energía astral que despierta en un mundo olvidado, sumido en sombras y caos.",
    technologies: ["React", "Framer Motion", "Tailwind"],
    inProgress: false,
    demoUrl: "https://landing-juego-animada.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/landing-page-react",
    image: landingAnimada,
  },
  {
    id: 5,
    title: "Academia de Artes Marciales",
    description: "Sitio web de una academia de artes marciales, con información sobre los diferentes tipos de artes marciales, sus beneficios y cómo contactar con la academia.",
    technologies: ["React", "Framer Motion", "CSS", "React Router"],
    inProgress: false, // ← Cambiar de true a false
    demoUrl: "https://artes-marciales-react.vercel.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/artes-marciales-react",
    image: SitioArtesMarciales,
  },
  {
    id: 6,
    title: "Plants Shop",
    description: "Una elegante tienda online de plantas desarrollada con React y Vite. Transforma tu hogar con plantas extraordinarias.",
    technologies: ["React", "React-router", "CSS"],
    inProgress: false,
    demoUrl: "https://plants-shop-react.netlify.app/",
    codeUrl: "https://github.com/cristian-micchele-dev/green-commerce-react",
    image: PlantsShop,
  }
]

// Proyectos Full Stack
export const fullStackProjects = [
  {
    id: 7,
    title: "MERN Auth & Task Manager",
    description: "Sistema completo de autenticación y gestión de tareas con JWT. Incluye registro, login, protección de rutas y CRUD completo.",
    technologies: ["React", "Node.js", "MongoDB", "Express", "JWT"],
    inProgress: false, // ← Cambiar de true a false
    demoUrl: "https://crud-auth-frontend.onrender.com/",
    codeUrl: "https://github.com/cristian-micchele-dev/Auth-mern-task/",
    image: Login,
  },
  {
    id: 8,
    title: "Ecommerce Fiebre Futbolera",
    description: "Ecommerce para venta de fotografias digitales, con carrito de compras, checkout y sistema de pago.",
    technologies: ["Wordpress", "Blocksy"],
    inProgress: false, // ← Cambiar de true a false
    demoUrl: "https://fiebrefutbolera.com/", // Agregar URL real si tienes
    image: FiebreFutbolera,
  },
  {
    id: 9,
    title: "Red social",
    description: "Plataforma social con posts, comentarios y sistema de seguimiento.",
    technologies: ["React", "Node.js", "MongoDB", "JWT"],
    inProgress: false, // ← Cambiar de true a false
    demoUrl: "#", // Agregar URL real si tienes
    codeUrl: "#", // Agregar URL real si tienes
    image: ProximamenteImage
  }
]