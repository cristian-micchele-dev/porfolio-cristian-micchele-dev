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
        return 'from-green-600 to-emerald-600' // Verde para backend
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

  return (
    <div className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
      
      {/* Imagen del proyecto */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <img 
            src={image} 
            alt={`Proyecto ${title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          // Placeholder con gradiente cuando no hay imagen
          <div className={`w-full h-full bg-gradient-to-br ${getGradient()} flex items-center justify-center relative`}>
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="text-center text-white relative z-10">
              <svg className="w-16 h-16 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium opacity-90">{title}</p>
            </div>
          </div>
        )}
        
        {/* Badge del tipo de proyecto - ACTUALIZADO */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor()} backdrop-blur-sm bg-opacity-90`}>
            {projectType === 'fullstack' ? 'Full Stack' :
             projectType === 'frontend' ? 'Frontend' : 
             projectType === 'backend' ? 'Backend' : 'Básico'}
          </span>
        </div>
        
        {/* Overlay con botones en hover */}
        <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <button 
            onClick={handleDemoClick}
            className={`px-4 py-2 rounded-lg text-white font-medium text-sm transition-all duration-200 ${
              inProgress 
                ? 'bg-slate-600 hover:bg-slate-500'
                : getButtonColor()
            }`}
          >
            {inProgress ? 'Próximamente' : 'Ver Demo'}
          </button>
          
          <button 
            onClick={handleCodeClick}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg font-medium text-sm transition-all duration-200 border border-slate-600"
          >
            Código
          </button>
        </div>
      </div>
      
      {/* Contenido de la card */}
      <div className="p-6">
        {/* Título */}
        <h4 className="text-slate-100 font-semibold text-lg mb-3">
          {title}
        </h4>
        
        {/* Descripción */}
        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {description}
        </p>
        
        {/* Tecnologías */}
        <div className="flex flex-wrap gap-2">
          {technologies.map((tech, i) => (
            <span key={i} className="bg-slate-700 text-slate-300 px-3 py-1 rounded-md text-xs font-medium border border-slate-600">
              {tech}
            </span>
          ))}
        </div>
        
        {/* Indicador de progreso */}
        {inProgress && (
          <div className="mt-4 flex items-center justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectCard