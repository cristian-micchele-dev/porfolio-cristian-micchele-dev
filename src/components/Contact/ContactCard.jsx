import ContactIcons from './ContactIcons'

const ContactCard = ({ method, onClick }) => {
  const {
    id,
    name,
    value,
    description,
    icon,
    bgColor,
    hoverColor,
    textColor,
    borderColor,
    shadowColor
  } = method

  return (
    <div 
      onClick={() => onClick(id, value)}
      className={`bg-slate-800 p-6 rounded-xl border border-slate-700 ${borderColor} transition-all duration-300 hover:shadow-xl ${shadowColor} group cursor-pointer transform hover:scale-105`}
    >
      <div className="text-center">
        <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4 ${hoverColor} transition-colors duration-300`}>
          <ContactIcons type={icon} />
        </div>
        <h3 className={`font-semibold text-slate-100 mb-2 ${textColor} transition-colors duration-200`}>
          {name}
        </h3>
        <p className="text-slate-300 text-sm break-all mb-2">
          {id === 'email' ? value : description}
        </p>
        {id === 'email' && (
          <p className="text-blue-400 text-xs">{description}</p>
        )}
      </div>
    </div>
  )
}

export default ContactCard