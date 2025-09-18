import { motion } from 'framer-motion'

function ProjectCard({ project, index }) {
  const { title, description, technologies, inProgress, demoUrl, codeUrl, image } = project
  
  // Determinar el tipo de proyecto por las tecnologías - CORREGIDO
  const getProjectType = () => {
    // Primero verificar si es un proyecto backend puro
    const hasBackendTech = technologies.some(tech => 
      ['Node.js', 'MongoDB', 'Express', 'Nest', 'NestJS', 'PostgreSQL', 'MySQL'].includes(tech)
    )
    const hasFrontendTech = technologies.some(tech => 
      ['React', 'Vue', 'Angular', 'Tailwind'].includes(tech)
    )
    
    // Si tiene tecnologías de backend Y frontend, es fullstack
    if (hasBackendTech && hasFrontendTech) {
      return 'fullstack'
    }
    
    // Si solo tiene tecnologías de frontend, es frontend
    if (hasFrontendTech) {
      return 'frontend'
    }
    
    // Si tiene tecnologías de backend pero no frontend, es backend
    if (hasBackendTech) {
      return 'backend'
    }
    
    // Si no tiene tecnologías específicas, es básico
    return 'basic'
  }
  
  const projectType = getProjectType()
  
  // Colores según el tipo de proyecto - ACTUALIZADO
  const getGradient = () => {
    if (inProgress) return 'from-slate-600 to-slate-700'
    
    switch (projectType) {
      case 'fullstack':
        return 'from-blue-600 to-indigo-600'
      case 'frontend':
        return 'from-purple-600 to-blue-600'
      case 'backend':
        return 'from-green-600 to-emerald-600' 
      default:
        return 'from-indigo-500 to-purple-500'
    }
  }
  
  const getButtonColor = () => {
    switch (projectType) {
      case 'fullstack':
        return 'bg-blue-600 hover:bg-blue-700'
      case 'frontend':
        return 'bg-purple-600 hover:bg-purple-700'
      case 'backend':
        return 'bg-green-600 hover:bg-green-700' // Verde para backend
      default:
        return 'bg-indigo-600 hover:bg-indigo-700'
    }
  }
  
  const getBadgeColor = () => {
    switch (projectType) {
      case 'fullstack':
        return 'bg-blue-600 text-white'
      case 'frontend':
        return 'bg-purple-600 text-white'
      case 'backend':
        return 'bg-green-600 text-white' // Verde para backend
      default:
        return 'bg-indigo-600 text-white'
    }
  }
  
  // Funciones para manejar los clics
  const handleDemoClick = () => {
    if (demoUrl && demoUrl !== '#') {
      window.open(demoUrl, '_blank')
    } else {
      alert('¡Próximamente! Este proyecto estará disponible pronto.')
    }
  }
  
  const handleCodeClick = () => {
    if (codeUrl && codeUrl !== '#') {
      window.open(codeUrl, '_blank')
    } else {
      alert('¡Próximamente! El código estará disponible pronto.')
    }
  }

  // Variantes de animación para la tarjeta
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  // Variantes para la imagen
  const imageVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  // Variantes para el overlay
  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  // Variantes para los botones del overlay
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    hover: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1
      }
    }
  }

  // Variantes para las tecnologías
  const techVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  // Variantes para el contenedor de tecnologías
  const techContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  }

  return (
    <motion.div 
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      
      {/* Imagen del proyecto */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <motion.img 
            src={image} 
            alt={`Proyecto ${title}`}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
        ) : (
          // Placeholder con gradiente cuando no hay imagen
          <motion.div 
            className={`w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center relative`}
            variants={imageVariants}
          >
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="text-center text-white relative z-10">
              <motion.svg 
                className="w-16 h-16 mx-auto mb-2 opacity-80" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </motion.svg>
              <p className="text-sm font-medium opacity-90">{title}</p>
            </div>
          </motion.div>
        )}
        
        {/* Badge del tipo de proyecto - ACTUALIZADO */}
        <motion.div 
          className="absolute top-3 right-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()} backdrop-blur-sm bg-opacity-90`}>
            {projectType === 'fullstack' ? 'Full Stack' :
             projectType === 'frontend' ? 'Frontend' : 
             projectType === 'backend' ? 'Backend' : 'Básico'}
          </span>
        </motion.div>
        
        {/* Overlay con botones en hover */}
        <motion.div 
          className="absolute inset-0 bg-slate-900/80 flex items-center justify-center space-x-3"
          variants={overlayVariants}
          initial="hidden"
          whileHover="hover"
        >
          <motion.button 
            onClick={handleDemoClick}
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 ${
              inProgress 
                ? 'bg-slate-600 hover:bg-slate-500'
                : getButtonColor()
            }`}
            variants={buttonVariants}
            whileTap="tap"
          >
            {inProgress ? 'Próximamente' : 'Ver Demo'}
          </motion.button>
          
          <motion.button 
            onClick={handleCodeClick}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium text-sm transition-all duration-200 border border-slate-600"
            variants={buttonVariants}
            whileTap="tap"
          >
            Código
          </motion.button>
        </motion.div>
      </div>
      
      {/* Contenido de la card */}
      <div className="p-6">
        {/* Título */}
        <motion.h4 
          className="text-slate-100 font-semibold text-lg mb-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h4>
        
        {/* Descripción */}
        <motion.p 
          className="text-slate-300 text-sm mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>
        
        {/* Botones para móviles - Solo visible en pantallas pequeñas */}
        <motion.div 
          className="flex space-x-3 mb-4 md:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button 
            onClick={handleDemoClick}
            className={`flex-1 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 ${
              inProgress 
                ? 'bg-slate-600 hover:bg-slate-500'
                : getButtonColor()
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {inProgress ? 'Próximamente' : 'Ver Demo'}
          </motion.button>
          
          <motion.button 
            onClick={handleCodeClick}
            className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium text-sm transition-all duration-200 border border-slate-600"
            whileTap={{ scale: 0.95 }}
          >
            Código
          </motion.button>
        </motion.div>
        
        {/* Tecnologías */}
        <motion.div 
          className="flex flex-wrap gap-2"
          variants={techContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {technologies.map((tech, i) => (
            <motion.span 
              key={i} 
              className="bg-slate-700 text-slate-300 px-3 py-1 rounded-md text-xs font-medium border border-slate-600"
              variants={techVariants}
              whileHover={{ scale: 1.05, backgroundColor: '#475569' }}
              transition={{ duration: 0.2 }}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>
        
        {/* Indicador de progreso */}
        {inProgress && (
          <motion.div 
            className="mt-4 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex space-x-1">
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2, delay: 0.1 }}
              />
              <motion.div 
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2, delay: 0.2 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard