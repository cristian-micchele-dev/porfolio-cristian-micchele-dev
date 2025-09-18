import { useState } from 'react'
import { motion } from 'framer-motion'
import AboutImage from './AboutImage'
import profileImage from '../assets/images/projects/yoavatar.png'

function About() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadCV = () => {
    setIsDownloading(true)
    
    // URL de descarga directa desde Google Drive (ahora público)
    const cvUrl = 'https://drive.google.com/uc?export=download&id=1WmDn2pZDVGE8EmlEoYrq1uQuoMGIszpO'
    
    // Abrir en nueva pestaña para descargar
    window.open(cvUrl, '_blank')
    
    // Resetear estado después de 2 segundos
    setTimeout(() => {
      setIsDownloading(false)
    }, 2000)
  }

  // Variantes de animación para el contenedor
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2
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

  // Variantes para la imagen
  const imageVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  }

  // Variantes para los párrafos de texto
  const textVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  // Variantes para el botón
  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  }

  return (
    <motion.section 
      id="sobre-mi" 
      className="py-16 bg-slate-800/30"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Header animado */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-slate-100 mb-4"
          variants={titleVariants}
        >
          Sobre Mí
        </motion.h2>
        <motion.div 
          className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"
          variants={lineVariants}
        />
      </div>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          {/* Imagen animada */}
          <motion.div 
            className="lg:col-span-1 flex justify-center"
            variants={imageVariants}
          >
            <AboutImage 
              src={profileImage}
              alt="Cristian - Desarrollador Full Stack"
            />
          </motion.div>
          
          {/* Contenido de texto animado */}
          <motion.div 
            className="lg:col-span-2 space-y-6"
            variants={containerVariants}
          >
            <div className="space-y-6">
              <motion.p 
                className="text-slate-300 text-lg leading-relaxed"
                variants={textVariants}
              >
                ¡Hola! Soy Cristian, un desarrollador Full Stack especializado en Backend con una pasión genuina por 
                construir soluciones tecnológicas robustas y escalables. Mi experiencia se centra en el ecosistema de 
                JavaScript del lado del servidor, dominando tecnologías como Node.js, Express, NestJS, TypeORM, junto 
                con bases de datos como MongoDB y MySQL.
              </motion.p>
              
              <motion.p 
                className="text-slate-300 text-lg leading-relaxed"
                variants={textVariants}
              >
                Complemento estas habilidades con conocimientos sólidos en frontend utilizando React y Tailwind CSS, lo 
                que me permite desarrollar aplicaciones completas con una visión integral del producto.
              </motion.p>
              
              <motion.p 
                className="text-slate-300 text-lg leading-relaxed"
                variants={textVariants}
              >
                Mi filosofía de desarrollo se basa en código limpio, arquitecturas mantenibles y la implementación 
                constante de las mejores prácticas de la industria.
              </motion.p>
            </div>
            
            {/* Botón animado */}
            <motion.div 
              className="pt-8"
              variants={buttonVariants}
            >
              <motion.button 
                onClick={handleDownloadCV}
                disabled={isDownloading}
                className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-semibold ${
                  isDownloading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <motion.svg 
                  className="w-4 h-4 inline mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={isDownloading ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 1, repeat: isDownloading ? Infinity : 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </motion.svg>
                {isDownloading ? 'Descargando...' : 'Descargar CV'}
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}

export default About