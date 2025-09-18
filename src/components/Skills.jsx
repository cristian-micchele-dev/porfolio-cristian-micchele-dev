import { motion } from 'framer-motion'
import { skillsData } from '../data/skillsData'

function Skills() {
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

  // Variantes para la línea decorativa
  const lineVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.3
      }
    }
  }

  // Variantes para las tarjetas de categorías
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

  // Variantes para los títulos de categorías
  const categoryTitleVariants = {
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

  // Variantes para las habilidades individuales
  const skillVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      x: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  // Variantes para el contenedor de habilidades
  const skillsContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  return (
    <motion.section 
      id="habilidades" 
      className="py-16 bg-slate-800/20"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header animado */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-slate-100 400 mb-4"
          variants={titleVariants}
        >
          {skillsData.title}
        </motion.h2>
        <motion.div 
          className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
          variants={lineVariants}
        />
      </div>
      
      {/* Grid de categorías animado */}
      <div className="max-w-6xl mx-auto">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {skillsData.categories.map((category, categoryIndex) => (
            <motion.div 
              key={category.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
              variants={cardVariants}
              whileHover="hover"
              custom={categoryIndex}
            >
              {/* Título de la categoría animado */}
              <motion.h3 
                className="text-lg font-semibold text-blue-400 mb-6 text-center"
                variants={categoryTitleVariants}
              >
                {category.title}
              </motion.h3>
              
              {/* Lista de habilidades animadas */}
              <motion.div 
                className="space-y-4"
                variants={skillsContainerVariants}
              >
                {category.skills.map((skill, skillIndex) => (
                  <motion.div 
                    key={skillIndex}
                    className="text-slate-300 text-center py-2 hover:text-blue-300 transition-colors duration-200 cursor-default"
                    variants={skillVariants}
                    whileHover="hover"
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

export default Skills