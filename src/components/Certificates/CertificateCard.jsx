import { motion } from 'framer-motion'
import CertificateIcon from './CertificateIcon'

const CertificateCard = ({ certificate, onClick, config = {}, index = 0 }) => {
  const { 
    id, 
    title, 
    issuer, 
    image, 
    credentialUrl, 
    category, 
    year, 
    skills 
  } = certificate

  const { showYear, showSkills, showCategory } = config

  // Variantes para la tarjeta de certificado
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.8,
      rotateY: -15
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        type: "tween",
        stiffness: 100
      }
    },
    hover: {
      y: -12,
      scale: 1.05,
      rotateY: 5,
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
        duration: 0.4,
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

  // Variantes para el contenido del placeholder
  const placeholderContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.2
      }
    }
  }

  // Variantes para el ícono del certificado
  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: 0.3
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  }

  // Variantes para las habilidades
  const skillVariants = {
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

  // Variantes para el contenedor de habilidades
  const skillsContainerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5
      }
    }
  }

  return (
    <motion.div 
      key={id} 
      className="group cursor-pointer"
      onClick={() => onClick(credentialUrl)}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Card simplificada - SOLO IMAGEN */}
      <div className="relative overflow-hidden rounded-xl transition-all duration-300 border border-slate-700 hover:border-blue-500/50 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20">
        {image ? (
          // Imagen real del certificado
          <motion.img 
            src={image} 
            alt={`Certificado ${title}`}
            className="w-full h-auto object-cover"
            variants={imageVariants}
          />
        ) : (
          // Placeholder con diseño azul-violeta
          <motion.div 
            className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-700 flex items-center justify-center border-2 border-dashed border-blue-500/30"
            variants={placeholderContentVariants}
          >
            <div className="text-center text-slate-300">
              {/* Icono de certificado con colores azul-violeta */}
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                variants={iconVariants}
                whileHover="hover"
              >
                <CertificateIcon />
              </motion.div>
              
              <motion.p 
                className="text-sm font-medium text-slate-200 mb-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {title}
              </motion.p>
              
              <motion.p 
                className="text-xs text-blue-400"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {issuer}
              </motion.p>
              
              {/* Información adicional opcional */}
              {showYear && year && (
                <motion.p 
                  className="text-xs text-slate-400 mt-1"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  viewport={{ once: true }}
                >
                  {year}
                </motion.p>
              )}
              
              {showCategory && category && (
                <motion.span 
                  className="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded-md text-xs mt-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  {category}
                </motion.span>
              )}
              
              {showSkills && skills && (
                <motion.div 
                  className="flex flex-wrap gap-1 mt-2 justify-center"
                  variants={skillsContainerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {skills.slice(0, 2).map((skill, skillIndex) => (
                    <motion.span 
                      key={skillIndex} 
                      className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs"
                      variants={skillVariants}
                      whileHover={{ 
                        scale: 1.05, 
                        backgroundColor: '#475569',
                        transition: { duration: 0.2 }
                      }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Overlay sutil SIN BOTÓN - Solo efecto visual */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"
          variants={overlayVariants}
          initial="hidden"
          whileHover="hover"
        />
      </div>
    </motion.div>
  )
}

export default CertificateCard