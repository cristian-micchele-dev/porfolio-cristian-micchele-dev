import { useState } from 'react'
import { motion } from 'framer-motion'
import AboutImage from './AboutImage'
import profileImage from '../assets/images/projects/yoavatar.png'

const CV_URL = 'https://drive.google.com/uc?export=download&id=1WmDn2pZDVGE8EmlEoYrq1uQuoMGIszpO'

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
}

const titleVariants = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const lineVariants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } }
}

const imageVariants = {
  hidden:  { opacity: 0, x: -50, scale: 0.8 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.8, ease: 'easeOut' } }
}

const textVariants = {
  hidden:  { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const buttonVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  hover:   { scale: 1.05, transition: { duration: 0.2, ease: 'easeInOut' } },
  tap:     { scale: 0.95 }
}

function About() {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadCV = () => {
    setIsDownloading(true)
    window.open(CV_URL, '_blank')
    setTimeout(() => setIsDownloading(false), 2000)
  }

  return (
    <motion.section
      id="sobre-mi"
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="text-center mb-12">
        <motion.h2 className="text-3xl font-bold text-ink mb-4" variants={titleVariants}>
          Sobre Mí
        </motion.h2>
        <motion.div className="w-16 h-px bg-brand mx-auto" variants={lineVariants} />
      </div>

      <div className="max-w-5xl mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12 items-start">

          <motion.div className="lg:col-span-1 flex justify-center" variants={imageVariants}>
            <AboutImage src={profileImage} alt="Cristian - Desarrollador Full Stack" />
          </motion.div>

          <motion.div className="lg:col-span-2 space-y-6" variants={containerVariants}>
            <div className="space-y-6">
              <motion.p className="text-ink-muted text-lg leading-relaxed" variants={textVariants}>
                ¡Hola! Soy Cristian, un desarrollador Full Stack especializado en Backend con una pasión genuina por
                construir soluciones tecnológicas robustas y escalables. Mi experiencia se centra en el ecosistema de
                JavaScript del lado del servidor, dominando tecnologías como Node.js, Express, NestJS, TypeORM, junto
                con bases de datos como MongoDB y MySQL.
              </motion.p>

              <motion.p className="text-ink-muted text-lg leading-relaxed" variants={textVariants}>
                Complemento estas habilidades con conocimientos sólidos en frontend utilizando React y Tailwind CSS, lo
                que me permite desarrollar aplicaciones completas con una visión integral del producto.
              </motion.p>

              <motion.p className="text-ink-muted text-lg leading-relaxed" variants={textVariants}>
                Mi filosofía de desarrollo se basa en código limpio, arquitecturas mantenibles y la implementación
                constante de las mejores prácticas de la industria.
              </motion.p>
            </div>

            <motion.div className="pt-8" variants={buttonVariants}>
              <motion.button
                onClick={handleDownloadCV}
                disabled={isDownloading}
                className={`bg-brand hover:bg-brand-dim text-canvas px-8 py-3 rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-brand/20 ${
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
