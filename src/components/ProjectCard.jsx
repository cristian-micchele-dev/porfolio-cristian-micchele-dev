import { motion } from 'framer-motion'

const BACKEND_TECHS  = new Set(['Node.js', 'MongoDB', 'Express', 'Nest', 'NestJS', 'PostgreSQL', 'MySQL'])
const FRONTEND_TECHS = new Set(['React', 'Vue', 'Angular', 'Tailwind'])

function getProjectMeta(technologies) {
  const hasBackend  = technologies.some(t => BACKEND_TECHS.has(t))
  const hasFrontend = technologies.some(t => FRONTEND_TECHS.has(t))

  if (hasBackend && hasFrontend) return { type: 'fullstack', label: 'Full Stack' }
  if (hasFrontend)               return { type: 'frontend',  label: 'Frontend' }
  if (hasBackend)                return { type: 'backend',   label: 'Backend' }
  return                                { type: 'basic',     label: 'Básico' }
}

// Definidos fuera del componente: no se recrean en cada render
const cardVariants = {
  hidden:  { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  hover:   { y: -6, scale: 1.01, transition: { duration: 0.3, ease: 'easeInOut' } }
}

const imageVariants = {
  hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeInOut' } }
}

const overlayVariants = {
  hidden: { opacity: 0 },
  hover:  { opacity: 1, transition: { duration: 0.25, ease: 'easeInOut' } }
}

const buttonVariants = {
  hidden: { opacity: 0, y: 16 },
  hover:  { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  tap:    { scale: 0.95, transition: { duration: 0.1 } }
}

const techVariants = {
  hidden:  { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
}

const techContainerVariants = {
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } }
}

function ProjectCard({ project }) {
  const { title, description, technologies, inProgress, demoUrl, codeUrl, image } = project
  const { label } = getProjectMeta(technologies)

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

  const demoButtonClass = inProgress
    ? 'bg-surface-raised text-ink-muted'
    : 'bg-brand hover:bg-brand-dim text-canvas'

  const demoLabel = inProgress ? 'Próximamente' : 'Ver Demo'

  return (
    <motion.div
      className="bg-surface rounded-xl overflow-hidden border border-white/[0.06] hover:border-brand/25 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 group"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, amount: 0.3 }}
    >
      {/* Imagen */}
      <div className="relative h-48 overflow-hidden">
        {image ? (
          <motion.img
            src={image}
            alt={`Proyecto ${title}`}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />
        ) : (
          <motion.div
            className="w-full h-full bg-gradient-to-br from-surface-raised to-surface-high flex items-center justify-center relative"
            variants={imageVariants}
          >
            <div className="absolute inset-0 bg-canvas/20" />
            <div className="text-center text-canvas relative z-10">
              <svg className="w-14 h-14 mx-auto mb-2 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium opacity-90">{title}</p>
            </div>
          </motion.div>
        )}

        {/* Badge tipo */}
        <motion.div
          className="absolute top-3 right-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-canvas/80 text-brand border border-brand/30 backdrop-blur-sm">
            {label}
          </span>
        </motion.div>

        {/* Overlay con botones — hereda hover del padre via propagación de variantes */}
        <motion.div
          className="absolute inset-0 bg-canvas/85 flex items-center justify-center space-x-3"
          variants={overlayVariants}
        >
          <motion.button
            onClick={handleDemoClick}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${demoButtonClass}`}
            variants={buttonVariants}
            whileTap="tap"
          >
            {demoLabel}
          </motion.button>

          <motion.button
            onClick={handleCodeClick}
            className="px-4 py-2 bg-surface-raised hover:bg-surface-high text-ink-muted rounded-lg font-medium text-sm transition-all duration-200 border border-white/[0.06]"
            variants={buttonVariants}
            whileTap="tap"
          >
            Código
          </motion.button>
        </motion.div>
      </div>

      {/* Contenido */}
      <div className="p-6">
        <motion.h4
          className="text-ink font-semibold text-base mb-2"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h4>

        <motion.p
          className="text-ink-muted text-sm mb-4 leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>

        {/* Botones móvil */}
        <motion.div
          className="flex space-x-3 mb-4 md:hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={handleDemoClick}
            className={`flex-1 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${demoButtonClass}`}
            whileTap={{ scale: 0.95 }}
          >
            {demoLabel}
          </motion.button>

          <motion.button
            onClick={handleCodeClick}
            className="flex-1 py-2 bg-surface-raised hover:bg-surface-high text-ink-muted rounded-lg font-medium text-sm transition-all duration-200 border border-white/[0.06]"
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
          {technologies.map((tech) => (
            <motion.span
              key={tech}
              className="bg-surface-raised text-ink-dim px-2.5 py-1 rounded-md text-xs font-medium border border-white/[0.06] hover:border-brand/25 hover:text-ink-muted transition-all duration-200"
              variants={techVariants}
            >
              {tech}
            </motion.span>
          ))}
        </motion.div>

        {inProgress && (
          <motion.div
            className="mt-4 flex items-center justify-center gap-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            viewport={{ once: true }}
          >
            {[0, 0.1, 0.2].map((delay, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 bg-brand rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.2, delay }}
              />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard
