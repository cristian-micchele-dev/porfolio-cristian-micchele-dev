import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function Hero() {
  // Estados para la animación typewriter
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const fullText = 'Desarrollador Full Stack'
  
  // Efecto para la animación de escritura
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100)
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, fullText])

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="inicio" className="text-center py-24 min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <motion.div 
        className="space-y-8 max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        
        {/* Saludo simple */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-6"
          variants={itemVariants}
        >
          Hola, soy Cristian
        </motion.h1>
        
        {/* Título con animación typewriter */}
        <motion.div 
          className="h-16 flex items-center justify-center"
          variants={itemVariants}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-400 mb-6">
            {displayedText}
            <span className="animate-pulse text-blue-400">|</span>
          </h2>
        </motion.div>
        
        {/* Descripción */}
        <motion.p 
          className="text-lg text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Construyendo aplicaciones robustas y escalables del lado del cliente y servidor
        </motion.p>
        
        {/* Indicador de scroll simple */}
        <motion.div 
          className="mt-12"
          variants={itemVariants}
          animate={{ 
            y: [0, -10, 0],
            transition: { 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        >
          <svg className="w-6 h-6 text-slate-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero