import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const FULL_TEXT = 'Desarrollador Full Stack'

const SOCIAL_LINKS = [
  {
    href:  'https://github.com/cristian-micchele-dev/',
    label: 'GitHub',
    path:  'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z',
    fillRule: 'evenodd',
    clipRule: 'evenodd',
  },
  {
    href:  'https://www.linkedin.com/in/cristian-micchele-1445a92b5/',
    label: 'LinkedIn',
    path:  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
]

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { delayChildren: 0.3, staggerChildren: 0.2 } }
}

const itemVariants = {
  hidden:  { y: 24, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
}

const socialHover = {
  scale:       1.05,
  color:       '#f4f4f6',
  borderColor: 'rgba(168,85,247,0.5)',
  boxShadow:   '0 0 16px rgba(168,85,247,0.2)',
}

function Hero() {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex]   = useState(0)

  useEffect(() => {
    if (currentIndex >= FULL_TEXT.length) return
    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + FULL_TEXT[currentIndex])
      setCurrentIndex(prev => prev + 1)
    }, 100)
    return () => clearTimeout(timeout)
  }, [currentIndex])

  return (
    <section id="inicio" className="text-center py-24 min-h-screen flex items-center justify-center relative">
      <motion.div
        className="space-y-8 max-w-4xl mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-brand/30 text-brand-soft bg-brand/5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Disponible para proyectos
          </span>
        </motion.div>

        {/* Nombre */}
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-ink mb-4 tracking-tight"
          variants={itemVariants}
        >
          Hola, soy{' '}
          <span
            className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #818cf8 100%)' }}
          >
            Cristian
          </span>
        </motion.h1>

        {/* Typewriter */}
        <motion.div className="h-14 flex items-center justify-center" variants={itemVariants}>
          <h2 className="text-2xl md:text-3xl font-light text-ink-muted tracking-wide">
            {displayedText}
            <span className="text-brand animate-pulse">|</span>
          </h2>
        </motion.div>

        {/* Descripción */}
        <motion.p
          className="text-base text-ink-dim mb-12 max-w-xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          Full Stack Developer · Construyendo aplicaciones robustas del cliente al servidor, con integración de herramientas de IA para acelerar el desarrollo
        </motion.p>

        {/* Social links */}
        <motion.div variants={itemVariants} className="flex justify-center gap-4">
          {SOCIAL_LINKS.map(({ href, label, path, fillRule, clipRule }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-brand/20 text-ink-muted"
              whileHover={socialHover}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule={fillRule} clipRule={clipRule} d={path} />
              </svg>
              {label}
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="mt-16"
          variants={itemVariants}
          animate={{ y: [0, -8, 0], transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
        >
          <svg className="w-5 h-5 text-ink-dim mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
