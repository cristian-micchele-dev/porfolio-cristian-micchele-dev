import { contactInfo, emailTemplate } from '../data/contactData'

export const useEmailHandler = () => {
  const openGmail = () => {
    const subject = encodeURIComponent(emailTemplate.subject)
    const body = encodeURIComponent(emailTemplate.body)
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactInfo.email}&su=${subject}&body=${body}`
    
    window.open(gmailUrl, '_blank')
  }

  const handleContactClick = (type, url) => {
    if (type === 'email') {
      openGmail()
    } else {
      window.open(url, '_blank')
    }
  }

  return { handleContactClick, openGmail }
}