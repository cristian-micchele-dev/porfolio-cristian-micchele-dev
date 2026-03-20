import { motion } from 'framer-motion'
import ProjectCard from './ProjectCard'

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
}

const titleVariants = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const subtitleVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } }
}

const lineVariants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.4 } }
}

const descriptionVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.6 } }
}

const gridVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.8 } }
}

function ProjectsSection({ title, subtitle, description, projects, id }) {
  if (!projects || projects.length === 0) return null

  return (
    <motion.section
      id={id}
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-16">
        <motion.h2 className="text-3xl font-bold text-ink mb-2" variants={titleVariants}>
          {title}
        </motion.h2>

        {subtitle && (
          <motion.h3
            className="text-sm font-medium text-brand mb-4 uppercase tracking-widest"
            variants={subtitleVariants}
          >
            {subtitle}
          </motion.h3>
        )}

        <motion.div className="w-16 h-px bg-brand mx-auto mb-6" variants={lineVariants} />

        {description && (
          <motion.p className="text-ink-dim max-w-2xl mx-auto text-sm" variants={descriptionVariants}>
            {description}
          </motion.p>
        )}
      </div>

      <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={gridVariants}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    </motion.section>
  )
}

export default ProjectsSection
