'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  /** Retraso en segundos. Para encadenar hermanos sin montar un stagger padre. */
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'article' | 'section'
}

/**
 * Entrada al entrar en viewport. DESIGN.md §6.
 *
 * Reglas que encapsula para que no se puedan violar desde fuera:
 *   - `once: true` siempre — nunca re-anima al volver a scrollear
 *   - desplazamiento de 14px en Y, nunca X, nunca scale
 *   - 400ms con el easing único del sistema
 *   - con `prefers-reduced-motion` el movimiento se cae y queda solo el fade
 */
export function Reveal({ children, delay = 0, className, as = 'div' }: RevealProps) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: reduce ? 0.18 : 0.4,
        delay: reduce ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </MotionTag>
  )
}
