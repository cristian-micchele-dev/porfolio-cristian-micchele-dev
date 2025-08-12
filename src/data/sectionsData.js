import { backendProjects, frontendProjects, fullStackProjects } from './projectsData'

export const projectSections = [
  {
    id: 'proyectos',
    title: 'Proyectos Backend',
    subtitle: 'Backend Projects',
    description: 'Donde todo comenzó - mis primeros pasos en el desarrollo web',
    projects: backendProjects,
  },
  {
    id: 'frontend-projects',
    title: 'Proyectos Frontend',
    subtitle: 'Frontend Development',
    description: 'Interfaces modernas y experiencias de usuario excepcionales',
    projects: frontendProjects,
  },
  {
    id: 'fullstack-projects',
    title: 'Proyectos Full Stack',
    subtitle: 'Full Stack Applications',
    description: 'Aplicaciones completas desde el frontend hasta la base de datos',
    projects: fullStackProjects,
  }
]

// Configuración adicional de secciones
export const sectionConfig = {
  showImages: true, // Habilitar/deshabilitar imágenes
  showIcons: true,  // Habilitar/deshabilitar iconos
  imageHeight: 'h-32', // Altura de las imágenes de sección
  defaultGradient: 'from-slate-600 to-slate-700' // Gradiente por defecto
}