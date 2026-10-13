import { profile } from '@/data/profile'
import { ResendMailer } from './ResendMailer'
import type { MailerPort } from './types'

/**
 * Resuelve el adaptador de correo según el entorno.
 *
 * Devuelve `null` cuando no hay credencial configurada, y eso NO es un bug:
 * es la razón por la que el endpoint responde 501 en lugar de mentir un
 * "mensaje enviado". Un formulario que dice 201 y tira el mensaje a la basura
 * hace que un reclutador escriba, crea que llegó y nunca reciba respuesta.
 * Es el peor bug posible en un portfolio.
 *
 * Para activarlo en Vercel:
 *   RESEND_API_KEY   = la clave de Resend
 *   CONTACT_FROM     = remitente de un dominio verificado
 *   CONTACT_TO       = opcional; por defecto el email del perfil
 */
export function resolveMailer(): MailerPort | null {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.CONTACT_FROM

  if (!apiKey || !from) return null

  return new ResendMailer({
    apiKey,
    from,
    to: process.env.CONTACT_TO ?? profile.email,
  })
}
