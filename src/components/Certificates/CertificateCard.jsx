import { motion } from 'framer-motion'
import CertificateIcon from './CertificateIcon'

const CertificateCard = ({ certificate, onClick, config = {}, index = 0 }) => {
  const { id, title, issuer, image, credentialUrl, category, year, skills } = certificate
  const { showYear, showSkills, showCategory } = config

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.8, rotateY: -15 },
    visible: {
      opacity: 1, y: 0, scale: 1, rotateY: 0,
      transition: { duration: 0.7, ease: "easeOut", type: "tween", stiffness: 100 }
    },
    hover: { y: -8, scale: 1.03, rotateY: 3, transition: { duration: 0.3, ease: "easeInOut" } }
  }

  const imageVariants = {
    hover: { scale: 1.06, transition: { duration: 0.4, ease: "easeInOut" } }
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    hover: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } }
  }

  const placeholderContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", delay: 0.2 } }
  }

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { scale: 1, rotate: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.3 } },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2, ease: "easeInOut" } }
  }

  const skillVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } }
  }

  const skillsContainerVariants = {
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } }
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
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] hover:border-brand/25 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand/5">
        {image ? (
          <motion.img
            src={image}
            alt={`Certificado ${title}`}
            className="w-full h-auto object-cover"
            variants={imageVariants}
          />
        ) : (
          <motion.div
            className="w-full h-64 bg-surface flex items-center justify-center border border-dashed border-brand/20"
            variants={placeholderContentVariants}
          >
            <div className="text-center text-ink-muted">
              <motion.div
                className="w-14 h-14 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand/20"
                variants={iconVariants}
                whileHover="hover"
              >
                <CertificateIcon />
              </motion.div>

              <motion.p
                className="text-sm font-medium text-ink mb-1"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {title}
              </motion.p>

              <motion.p
                className="text-xs text-brand"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
              >
                {issuer}
              </motion.p>

              {showYear && year && (
                <motion.p
                  className="text-xs text-ink-dim mt-1"
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
                  className="inline-block bg-brand/10 text-brand px-2 py-1 rounded-md text-xs mt-2 border border-brand/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  viewport={{ once: true }}
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
                      className="bg-surface-raised text-ink-dim px-2 py-1 rounded text-xs border border-white/[0.06]"
                      variants={skillVariants}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-canvas/50 via-transparent to-transparent"
          variants={overlayVariants}
          initial="hidden"
          whileHover="hover"
        />
      </div>
    </motion.div>
  )
}

export default CertificateCard
