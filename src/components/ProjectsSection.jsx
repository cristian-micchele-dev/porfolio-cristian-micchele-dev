import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

function ProjectsSection({ title, subtitle, description, projects, id }) {
  // Validación de props
  if (!projects || projects.length === 0) {
    return null
  }

  // Variantes para el contenedor principal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  // Variantes para el título
  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Variantes para el subtítulo
  const subtitleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  // Variantes para la línea decorativa
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.4
      }
    }
  }

  // Variantes para la descripción
  const descriptionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.6
      }
    }
  }

  // Variantes para el grid de proyectos
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.8
      }
    }
  }

  return (
    <motion.section 
      id={id} 
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-16">
        <motion.h2 
          className="text-3xl font-bold text-slate-100 mb-2"
          variants={titleVariants}
        >
          {title}
        </motion.h2>
        
        {/* Subtítulo animado */}
        {subtitle && (
          <motion.h3 
            className="text-lg font-medium text-blue-400 mb-4 uppercase tracking-wider"
            variants={subtitleVariants}
          >
            {subtitle}
          </motion.h3>
        )}
        
        <motion.div 
          className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
          variants={lineVariants}
        />
        
        {/* Descripción animada */}
        {description && (
          <motion.p 
            className="text-slate-400 max-w-2xl mx-auto"
            variants={descriptionVariants}
          >
            {description}
          </motion.p>
        )}
      </div>
      
      {/* Grid de proyectos animado */}
      <motion.div 
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={gridVariants}
      >
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index + 1}
          />
        ))}
      </motion.div>
    </motion.section>
  )
}

export default ProjectsSection