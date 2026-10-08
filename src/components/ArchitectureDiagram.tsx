'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { architectureLayers } from '@/data/architecture'
import { cn } from '@/lib/cn'
import type { ArchitectureLayer } from '@/types/content'

/** De afuera hacia adentro: infrastructure envuelve a adapters, y así hasta domain. */
const nested = [...architectureLayers].reverse()

/**
 * Las capas como anillos concéntricos, no como cascada.
 *
 * En Clean/Hexagonal las capas no son una pila: infrastructure CONTIENE a
 * adapters, que contiene a application, que contiene a domain. Y las
 * dependencias apuntan hacia adentro — el dominio no conoce a nadie.
 * Dibujarlo con flechas hacia abajo sería dibujarlo mal, aunque el brief lo
 * haya pedido así: la cascada sugiere un flujo que no existe.
 *
 * Los anillos entran de afuera hacia adentro, que se lee como el sistema
 * construyéndose alrededor del núcleo.
 */
export function ArchitectureDiagram() {
  return (
    <div>
      <Ring layers={nested} depth={0} />

      <p className="mt-4 flex items-center justify-center gap-2 font-mono text-[13px] text-fg-muted">
        <ArrowUp size={14} aria-hidden="true" className="text-accent" />
        las dependencias apuntan hacia adentro
      </p>
    </div>
  )
}

interface RingProps {
  layers: readonly ArchitectureLayer[]
  depth: number
}

function Ring({ layers, depth }: RingProps) {
  const reduce = useReducedMotion()
  const [current, ...inner] = layers
  if (!current) return null

  const isCore = inner.length === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: reduce ? 0.18 : 0.34,
        delay: reduce ? 0 : depth * 0.09,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        'rounded-panel border p-3',
        // El núcleo se marca con un borde en acento: es el único punto del
        // diagrama que merece atención preferente.
        isCore ? 'border-accent-dim bg-accent/5' : 'border-line',
        depth === 0 ? 'bg-surface' : 'bg-canvas/40',
      )}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className={cn('font-mono text-[13px]', isCore ? 'text-accent' : 'text-fg')}>
          {current.name}
        </span>
        <span className="label-mono text-fg-faint">{current.examples.join(' · ')}</span>
      </div>

      {inner.length > 0 && (
        <div className="mt-3">
          <Ring layers={inner} depth={depth + 1} />
        </div>
      )}
    </motion.div>
  )
}
