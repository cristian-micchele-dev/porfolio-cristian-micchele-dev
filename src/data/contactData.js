export const contactInfo = {
  email: "c.micchele@gmail.com",
  github: "https://github.com/cristian-micchele-dev/",
  linkedin: "https://www.linkedin.com/in/cristian-micchele-1445a92b5/",
  message: "¿Tienes un proyecto en mente? Me encantaría colaborar contigo y crear algo increíble juntos."
}

export const emailTemplate = {
  subject: 'Oportunidad de colaboración - Portfolio',
  body: `Hola Cristian,

He visto tu portfolio y me interesa contactarte para:

[ ] Oportunidad laboral
[ ] Proyecto freelance
[ ] Colaboración
[ ] Consulta técnica
[ ] Otro: ___________

Detalles del proyecto/oportunidad:



Saludos,
[Tu nombre]`
}

export const contactMethods = [
  {
    id: 'email',
    name: 'Email',
    value: contactInfo.email,
    description: 'Abrir en Gmail',
    icon: 'gmail',
    bgColor: 'bg-blue-600',
    hoverColor: 'group-hover:bg-blue-500',
    textColor: 'group-hover:text-blue-400',
    borderColor: 'hover:border-blue-500/50',
    shadowColor: 'hover:shadow-blue-500/10'
  },
  {
    id: 'github',
    name: 'GitHub',
    value: contactInfo.github,
    description: 'Ver mis repositorios',
    icon: 'github',
    bgColor: 'bg-slate-700',
    hoverColor: 'group-hover:bg-slate-600',
    textColor: 'group-hover:text-slate-400',
    borderColor: 'hover:border-slate-500/50',
    shadowColor: 'hover:shadow-slate-500/10'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    value: contactInfo.linkedin,
    description: 'Conectemos profesionalmente',
    icon: 'linkedin',
    bgColor: 'bg-blue-700', // ← Cambiar de bg-purple-600 a bg-blue-700
    hoverColor: 'group-hover:bg-blue-600', // ← Cambiar de group-hover:bg-purple-500 a group-hover:bg-blue-600
    textColor: 'group-hover:text-blue-400', // ← Cambiar de group-hover:text-purple-400 a group-hover:text-blue-400
    borderColor: 'hover:border-blue-500/50', // ← Cambiar de hover:border-purple-500/50 a hover:border-blue-500/50
    shadowColor: 'hover:shadow-blue-500/10' // ← Cambiar de hover:shadow-purple-500/10 a hover:shadow-blue-500/10
  }
]