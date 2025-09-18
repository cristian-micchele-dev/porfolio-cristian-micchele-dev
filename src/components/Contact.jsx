import { motion } from 'framer-motion'
import ContactCard from './Contact/ContactCard'
import CallToAction from './Contact/CallToAction'
import { contactInfo, contactMethods } from '../data/contactData'
import { useEmailHandler } from '../hooks/useEmailHandler'

function Contact() {
  const { handleContactClick } = useEmailHandler()

  // Variantes para el contenedor principal
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
        duration: 0.8,
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

  // Variantes para el mensaje
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5
      }
    }
  }

  // Variantes para el grid de tarjetas
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.7
      }
    }
  }

  return (
    <motion.section 
      id="contacto" 
      className="py-16 bg-slate-800/30"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Header animado */}
      <div className="text-center mb-12">
        <motion.h2 
          className="text-3xl font-bold text-slate-100 mb-4"
          variants={titleVariants}
        >
          ¡Conectemos!
        </motion.h2>
        
        <motion.div 
          className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"
          variants={lineVariants}
        />
        
        <motion.p 
          className="text-slate-300 max-w-2xl mx-auto text-lg"
          variants={messageVariants}
        >
          {contactInfo.message}
        </motion.p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Tarjetas de contacto animadas */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 mb-12"
          variants={gridVariants}
        >
          {contactMethods.map((method, index) => (
            <ContactCard 
              key={method.id}
              method={method}
              onClick={handleContactClick}
              index={index}
            />
          ))}
        </motion.div>

        {/* Llamada a la acción animada */}
        <CallToAction 
          onEmailClick={() => handleContactClick('email', contactInfo.email)}
          onLinkedInClick={() => handleContactClick('linkedin', contactInfo.linkedin)}
        />
      </div>
    </motion.section>
  )
}

export default Contact