import type { ContactDraft } from '@/lib/contact'
import type { MailerPort } from './types'

interface ResendMailerConfig {
  apiKey: string
  /** Remitente verificado en Resend. */
  from: string
  /** Destinatario: el mail de Cristian. */
  to: string
}

/**
 * Adaptador de correo sobre la API de Resend.
 *
 * Se usa `fetch` directo en lugar del SDK: es una sola llamada HTTP y no
 * justifica una dependencia más en el bundle del servidor.
 */
export class ResendMailer implements MailerPort {
  readonly name = 'resend'

  constructor(private readonly config: ResendMailerConfig) {}

  async send(message: ContactDraft): Promise<{ id: string }> {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.config.from,
        to: [this.config.to],
        reply_to: message.email,
        subject: `Portfolio — ${message.name}`,
        text: `${message.message}\n\n—\n${message.name}\n${message.email}`,
      }),
    })

    if (!response.ok) {
      // El cuerpo del error de Resend puede traer detalles del remitente o del
      // dominio: se loguea del lado del servidor y nunca se devuelve al cliente.
      const detail = await response.text().catch(() => '')
      throw new Error(`resend_failed:${response.status}:${detail.slice(0, 200)}`)
    }

    const payload = (await response.json()) as { id?: string }
    return { id: payload.id ?? 'unknown' }
  }
}
