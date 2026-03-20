import ContactIcons from './ContactIcons'

const ContactCard = ({ method, onClick }) => {
  const { id, name, value, description, icon } = method

  return (
    <div
      onClick={() => onClick(id, value)}
      className="bg-surface p-6 rounded-xl border border-white/[0.06] hover:border-brand/25 transition-all duration-300 hover:shadow-lg hover:shadow-brand/5 group cursor-pointer"
    >
      <div className="text-center">
        <div className="w-14 h-14 bg-surface-raised rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-brand/10 transition-colors duration-300 border border-white/[0.06]">
          <ContactIcons type={icon} />
        </div>
        <h3 className="font-semibold text-ink mb-2 group-hover:text-brand transition-colors duration-200 text-sm">
          {name}
        </h3>
        <p className="text-ink-muted text-xs break-all mb-1">
          {id === 'email' ? value : description}
        </p>
        {id === 'email' && (
          <p className="text-brand text-xs">{description}</p>
        )}
      </div>
    </div>
  )
}

export default ContactCard
