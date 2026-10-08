import type { ContactDraft } from '@/lib/contact'

export interface MailerPort {
  readonly name: string
  send(message: ContactDraft): Promise<{ id: string }>
}
