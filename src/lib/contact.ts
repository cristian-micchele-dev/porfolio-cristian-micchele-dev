export interface ContactDraft {
  name: string
  email: string
  message: string
}

export type ContactField = keyof ContactDraft

export type ContactErrors = Partial<Record<ContactField, string>>

export const CONTACT_LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 160 },
  message: { min: 10, max: 2000 },
} as const

/**
 * Validación de email deliberadamente permisiva.
 *
 * No se intenta implementar RFC 5322: toda regex "estricta" de email rechaza
 * direcciones válidas y deja pasar inválidas igual. Lo único que se puede
 * verificar de verdad es que la dirección exista, y eso lo hace el envío.
 * Acá sólo se atajan los errores de tipeo evidentes.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@.]+\.[^\s@]{2,}$/

export const EMPTY_DRAFT: ContactDraft = { name: '', email: '', message: '' }

export function validateContact(draft: ContactDraft): ContactErrors {
  const errors: ContactErrors = {}
  const name = draft.name.trim()
  const email = draft.email.trim()
  const message = draft.message.trim()

  if (name.length === 0) {
    errors.name = 'Falta tu nombre.'
  } else if (name.length < CONTACT_LIMITS.name.min) {
    errors.name = `Mínimo ${CONTACT_LIMITS.name.min} caracteres.`
  } else if (name.length > CONTACT_LIMITS.name.max) {
    errors.name = `Máximo ${CONTACT_LIMITS.name.max} caracteres.`
  }

  if (email.length === 0) {
    errors.email = 'Falta tu email.'
  } else if (email.length > CONTACT_LIMITS.email.max) {
    errors.email = `Máximo ${CONTACT_LIMITS.email.max} caracteres.`
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Ese email no parece válido.'
  }

  if (message.length === 0) {
    errors.message = 'Falta el mensaje.'
  } else if (message.length < CONTACT_LIMITS.message.min) {
    errors.message = `Contame un poco más: mínimo ${CONTACT_LIMITS.message.min} caracteres.`
  } else if (message.length > CONTACT_LIMITS.message.max) {
    errors.message = `Máximo ${CONTACT_LIMITS.message.max} caracteres.`
  }

  return errors
}

export function isValidContact(draft: ContactDraft): boolean {
  return Object.keys(validateContact(draft)).length === 0
}

/** Recorta y normaliza antes de enviar o de componer un mailto. */
export function sanitizeContact(draft: ContactDraft): ContactDraft {
  return {
    name: draft.name.trim(),
    email: draft.email.trim(),
    message: draft.message.trim(),
  }
}

/**
 * Compone el mailto de respaldo.
 *
 * Es el plan B cuando el servidor de correo no está configurado: antes de
 * mentir un "mensaje enviado", se le entrega al visitante el mensaje ya
 * escrito en su propio cliente de mail.
 */
export function buildMailto(to: string, draft: ContactDraft): string {
  const clean = sanitizeContact(draft)
  const subject = `Contacto desde el portfolio — ${clean.name}`
  const body = `${clean.message}\n\n—\n${clean.name}\n${clean.email}`

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
