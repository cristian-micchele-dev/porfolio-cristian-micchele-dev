'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Panel } from '@/components/primitives/Panel'
import { SITE_URL } from '@/lib/site'
import { stripProtocol } from '@/lib/format'
import { cn } from '@/lib/cn'

const COMMAND = `curl ${stripProtocol(SITE_URL)}/api`

/**
 * La invitación a probar la API.
 *
 * El sitio exhibe `GET /api/... → 200 OK` en cada sección y esos endpoints
 * responden de verdad — pero el visitante no tiene forma de enterarse salvo
 * que se le ocurra probarlos. Era la mejor idea del portfolio, invisible.
 *
 * Va en Contact y no en el hero: le habla a quien ya está evaluando en serio,
 * y el hero no necesita más ruido.
 */
export function CurlInvite() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current) }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(COMMAND)
      setCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Sin permiso de portapapeles o en contexto no seguro: el comando está
      // a la vista y se puede seleccionar a mano. No hace falta avisar nada.
    }
  }

  return (
    <Panel label="api">
      <div className="p-4">
        <p className="text-[15px] leading-relaxed text-fg-muted">
          Cada sección muestra su request. No son ilustraciones: los endpoints responden.
        </p>

        <div className="mt-3 flex items-center gap-2 rounded-[4px] border border-line bg-canvas px-3 py-2">
          <code className="min-w-0 flex-1 overflow-x-auto font-mono text-[13px] text-fg">
            <span className="text-fg-faint">$ </span>
            {COMMAND}
          </code>

          <button
            type="button"
            onClick={copy}
            aria-label={copied ? 'Comando copiado' : 'Copiar comando'}
            className={cn(
              'shrink-0 rounded-[3px] border p-1.5 transition-colors',
              copied
                ? 'border-ok text-ok'
                : 'border-line text-fg-muted hover:border-line-hi hover:text-fg',
            )}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* El estado se anuncia por texto, no sólo por el cambio de ícono */}
        <p aria-live="polite" className="mt-2 label-mono text-fg-faint">
          {copied ? 'copiado' : 'devuelve el mapa de la api'}
        </p>
      </div>
    </Panel>
  )
}
