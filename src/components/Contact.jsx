import ContactCard from './Contact/ContactCard'
import CallToAction from './Contact/CallToAction'
import { contactInfo, contactMethods } from '../data/contactData'
import { useEmailHandler } from '../hooks/useEmailHandler'

function Contact() {
  const { handleContactClick } = useEmailHandler()

  return (
    <section id="contacto" className="py-16 bg-slate-800/30">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-100 mb-4">
          ¡Conectemos!
        </h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6"></div>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg">
          {contactInfo.message}
        </p>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Tarjetas de contacto */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method) => (
            <ContactCard 
              key={method.id}
              method={method}
              onClick={handleContactClick}
            />
          ))}
        </div>

        {/* Llamada a la acción */}
        <CallToAction 
          onEmailClick={() => handleContactClick('email', contactInfo.email)}
          onLinkedInClick={() => handleContactClick('linkedin', contactInfo.linkedin)}
        />

        {/* Nota final */}
       
      </div>
    </section>
  )
}

export default Contact