import { motion } from 'framer-motion'
import { skillsData } from '../data/skillsData'

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
}

const titleVariants = {
  hidden:  { opacity: 0, y: -30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const lineVariants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: 'easeOut', delay: 0.3 } }
}

const cardVariants = {
  hidden:  { opacity: 0, y: 50, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  hover:   { y: -6, scale: 1.02, transition: { duration: 0.3, ease: 'easeInOut' } }
}

const categoryTitleVariants = {
  hidden:  { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut', delay: 0.2 } }
}

const skillVariants = {
  hidden:  { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  hover:   { scale: 1.05, x: 4, transition: { duration: 0.2, ease: 'easeInOut' } }
}

const skillsContainerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
}

function Skills() {
  return (
    <motion.section
      id="habilidades"
      className="py-16"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="text-center mb-12">
        <motion.h2 className="text-3xl font-bold text-ink mb-4" variants={titleVariants}>
          {skillsData.title}
        </motion.h2>
        <motion.div className="w-16 h-px bg-brand mx-auto mb-6" variants={lineVariants} />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <motion.div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants}>
          {skillsData.categories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              className="bg-surface border border-white/[0.06] rounded-xl p-6 hover:border-brand/25 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5"
              variants={cardVariants}
              whileHover="hover"
              custom={categoryIndex}
            >
              <motion.h3
                className="text-sm font-semibold text-brand mb-6 text-center uppercase tracking-widest"
                variants={categoryTitleVariants}
              >
                {category.title}
              </motion.h3>

              <motion.div className="space-y-3" variants={skillsContainerVariants}>
                {category.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    className="text-ink-muted text-sm text-center py-1.5 hover:text-brand transition-colors duration-200 cursor-default"
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
