import { skillsData } from '../data/skillsData'

function Skills() {
  return (
    <section id="habilidades" className="py-16 bg-slate-800/20">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-100 400 mb-4">
          {skillsData.title}
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
      </div>
      
      {/* Grid de categorías */}
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsData.categories.map((category) => (
            <div 
              key={category.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Título de la categoría */}
              <h3 className="text-lg font-semibold text-blue-400 mb-6 text-center">
                {category.title}
              </h3>
              
              {/* Lista de habilidades */}
              <div className="space-y-4">
                {category.skills.map((skill, index) => (
                  <div 
                    key={index}
                    className="text-slate-300 text-center py-2 hover:text-blue-300 transition-colors duration-200"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills