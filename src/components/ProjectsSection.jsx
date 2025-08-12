import ProjectCard from './ProjectCard'

function ProjectsSection({ title, subtitle, description, projects, id }) {
  // Validación de props
  if (!projects || projects.length === 0) {
    return null
  }

  return (
    <section id={id} className="py-16">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          {title}
        </h2>
        
        {/* Subtítulo */}
        {subtitle && (
          <h3 className="text-lg font-medium text-blue-400 mb-4 uppercase tracking-wider">
            {subtitle}
          </h3>
        )}
        
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
        
        {/* Descripción */}
        {description && (
          <p className="text-slate-400 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>
      
      {/* Grid de proyectos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index + 1}
          />
        ))}
      </div>
    </section>
  )
}

export default ProjectsSection