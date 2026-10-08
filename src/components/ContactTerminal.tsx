'use client'

import { useId, useState } from 'react'
import { ArrowUpRight, Send } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { StatusDot } from '@/components/primitives/StatusDot'
import { ResponseBlock } from '@/components/primitives/ResponseBlock'
import { profile } from '@/data/profile'
import {
  CONTACT_LIMITS,
  EMPTY_DRAFT,
  buildMailto,
  sanitizeContact,
  validateContact,
  type ContactDraft,
  type ContactErrors,
} from '@/lib/contact'
import { cn } from '@/lib/cn'

type Status = 'idle' | 'sending' | 'created' | 'fallback' | 'error' | 'rate_limited'

const STATUS_META: Record<Status, { label: string; tone: 'ok' | 'warn' | 'err' | 'muted' }> = {
  idle: { label: 'idle', tone: 'muted' },
  sending: { label: 'sending', tone: 'warn' },
  created: { label: '201 created', tone: 'ok' },
  fallback: { label: '501 not implemented', tone: 'warn' },
  error: { label: '502 bad gateway', tone: 'err' },
  rate_limited: { label: '429 too many', tone: 'warn' },
}

/**
 * POST /contact — el formulario como request.
 *
 * Los labels son las claves del JSON: el diseño y la accesibilidad coinciden
 * en lugar de pelearse. No hay placeholders haciendo de label.
 */
export function ContactTerminal() {
  const [draft, setDraft] = useState<ContactDraft>(EMPTY_DRAFT)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<Status>('idle')
  const formId = useId()

  const update = (field: keyof ContactDraft) => (value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
    // Limpia el error del campo al corregirlo: el error se recalcula al enviar.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (status === 'sending') return

    const found = validateContact(draft)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitizeContact(draft)),
      })

      if (response.status === 201) {
        setStatus('created')
        return
      }
      if (response.status === 501 || response.status === 502) {
        setStatus(response.status === 501 ? 'fallback' : 'error')
        return
      }
      if (response.status === 429) {
        setStatus('rate_limited')
        return
      }
      if (response.status === 422) {
        const payload = (await response.json()) as { fields?: ContactErrors }
        setErrors(payload.fields ?? {})
        setStatus('idle')
        return
      }
      setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'created') {
    return (
      <div>
        <ResponseBlock
          method="POST"
          path="/api/contact"
          status={201}
          statusText="CREATED"
          body={{ status: 'created', message: 'Message sent successfully.' }}
        />
        <p className="mt-4 text-fg-muted">
          Gracias por escribir. Te respondo a <span className="font-mono text-fg">{draft.email}</span>.
        </p>
      </div>
    )
  }

  const meta = STATUS_META[status]

  return (
    <div>
      <Panel
        label="POST /api/contact"
        headerRight={
          <StatusDot
            tone={meta.tone}
            label={meta.label}
            visuallyHidden={false}
            labelClassName="label-mono text-fg-muted"
          />
        }
      >
        <form onSubmit={submit} noValidate className="p-4 font-mono text-sm">
          <p aria-hidden="true" className="text-fg-muted">
            {'{'}
          </p>

          <div className="space-y-4 py-2 pl-4">
            <Field
              id={`${formId}-name`}
              name="name"
              label="name"
              value={draft.name}
              error={errors.name}
              maxLength={CONTACT_LIMITS.name.max}
              onChange={update('name')}
              autoComplete="name"
            />
            <Field
              id={`${formId}-email`}
              name="email"
              label="email"
              type="email"
              value={draft.email}
              error={errors.email}
              maxLength={CONTACT_LIMITS.email.max}
              onChange={update('email')}
              autoComplete="email"
            />
            <Field
              id={`${formId}-message`}
              name="message"
              label="message"
              value={draft.message}
              error={errors.message}
              maxLength={CONTACT_LIMITS.message.max}
              onChange={update('message')}
              multiline
            />
          </div>

          <p aria-hidden="true" className="text-fg-muted">
            {'}'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-4">
            <button
              type="submit"
              disabled={status === 'sending'}
              className={cn(
                'inline-flex items-center gap-2 rounded-[4px] border border-accent-dim px-3 py-2',
                'label-mono text-accent transition-colors duration-150',
                'hover:border-accent hover:bg-accent/5',
                'disabled:cursor-not-allowed disabled:opacity-40',
              )}
            >
              <Send size={14} aria-hidden="true" />
              {status === 'sending' ? 'sending…' : 'send request'}
            </button>

            <span className="font-mono text-[13px] tabular-nums text-fg-faint">
              {draft.message.trim().length}/{CONTACT_LIMITS.message.max}
            </span>
          </div>
        </form>
      </Panel>

      {(status === 'fallback' || status === 'error' || status === 'rate_limited') && (
        <ServerFallback status={status} draft={draft} />
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

interface FieldProps {
  id: string
  name: string
  label: string
  value: string
  error?: string
  maxLength: number
  onChange: (value: string) => void
  type?: string
  multiline?: boolean
  autoComplete?: string
}

function Field({
  id,
  name,
  label,
  value,
  error,
  maxLength,
  onChange,
  type = 'text',
  multiline = false,
  autoComplete,
}: FieldProps) {
  const errorId = `${id}-error`

  const shared = {
    id,
    name,
    value,
    maxLength,
    autoComplete,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(e.target.value),
    className: cn(
      'w-full rounded-[3px] border bg-canvas px-2 py-1.5 font-mono text-sm text-fg',
      'outline-none transition-colors placeholder:text-fg-faint',
      error ? 'border-err' : 'border-line focus:border-accent-dim',
    ),
  }

  return (
    <div>
      {/* El label ES la clave del JSON: diseño y accesibilidad coinciden */}
      <label htmlFor={id} className="mb-1.5 block">
        <span className="text-fg">&quot;{label}&quot;</span>
        <span className="text-fg-muted">: </span>
      </label>

      {multiline ? <textarea {...shared} rows={5} /> : <input {...shared} type={type} />}

      {error && (
        <p id={errorId} role="alert" className="mt-1.5 font-mono text-[13px] text-err">
          {error}
        </p>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */

/**
 * El respaldo honesto.
 *
 * Cuando el servidor no puede entregar el mensaje, se lo dice al visitante y
 * le entrega el mail ya escrito en su propio cliente. Nunca un "201" falso.
 */
function ServerFallback({
  status,
  draft,
}: {
  status: 'fallback' | 'error' | 'rate_limited'
  draft: ContactDraft
}) {
  if (status === 'rate_limited') {
    return (
      <p role="alert" className="mt-4 text-fg-muted">
        Demasiados envíos desde esta conexión. Probá de nuevo en unos minutos, o escribime
        directo a{' '}
        <a
          href={`mailto:${profile.email}`}
          className="text-accent underline decoration-accent-dim underline-offset-4"
        >
          {profile.email}
        </a>
        .
      </p>
    )
  }

  return (
    <div role="alert" className="mt-4 rounded-panel border border-line bg-surface p-4">
      <p className="label-mono text-warn">
        {status === 'fallback' ? 'entrega no configurada' : 'el envío falló'}
      </p>
      <p className="mt-2 text-fg-muted">
        {status === 'fallback'
          ? 'El servidor de correo de este sitio todavía no está conectado, así que tu mensaje no se envió. No te voy a decir que sí.'
          : 'El proveedor de correo rechazó el envío, así que tu mensaje no llegó.'}
      </p>
      <p className="mt-2 text-fg-muted">Tu mensaje está escrito: abrilo en tu cliente de mail.</p>

      <a
        href={buildMailto(profile.email, draft)}
        className="mt-4 inline-flex items-center gap-2 rounded-[4px] border border-accent-dim px-3 py-2 label-mono text-accent transition-colors hover:border-accent hover:bg-accent/5"
      >
        abrir en mi cliente de mail
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  )
}
