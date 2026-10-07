import { cn } from '@/lib/cn'

export type DotTone = 'ok' | 'warn' | 'err' | 'accent' | 'muted'

const TONE: Record<DotTone, string> = {
  ok: 'bg-ok',
  warn: 'bg-warn',
  err: 'bg-err',
  accent: 'bg-accent',
  muted: 'bg-fg-faint',
}

interface StatusDotProps {
  tone?: DotTone
  /** Halo pulsante. Reservado para el estado "available" del hero. */
  pulse?: boolean
  /**
   * Texto accesible. Obligatorio: ningún estado se comunica solo por color
   * (DESIGN.md §7). Si el label ya está visible al lado, pasá `visuallyHidden`.
   */
  label: string
  visuallyHidden?: boolean
  className?: string
  /** Clases del label cuando es visible. Default: mono 14px en fg-muted. */
  labelClassName?: string
}

export function StatusDot({
  tone = 'ok',
  pulse = false,
  label,
  visuallyHidden = true,
  className,
  labelClassName = 'font-mono text-sm text-fg-muted',
}: StatusDotProps) {
  return (
    <span className={cn('relative inline-flex shrink-0 items-center', className)}>
      <span className={cn('size-1.5 rounded-full', TONE[tone])} aria-hidden="true" />
      {pulse && (
        <span
          className={cn('absolute left-0 size-1.5 animate-ping rounded-full opacity-60', TONE[tone])}
          aria-hidden="true"
        />
      )}
      <span className={visuallyHidden ? 'sr-only' : cn('ml-2', labelClassName)}>{label}</span>
    </span>
  )
}
