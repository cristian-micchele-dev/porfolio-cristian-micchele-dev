'use client'

import { useEffect } from 'react'
import { BOOT_STORAGE_KEY } from '@/lib/boot'

/**
 * Marca el boot como visto y permite omitirlo.
 *
 * No renderiza nada: sólo pone `data-booted` en `<html>`, que es lo que la
 * hoja de estilos usa para ocultar el overlay. El atributo lo setea también
 * un script inline antes del primer paint (ver `layout.tsx`), así quien
 * recarga rápido no vuelve a ver la secuencia ni por un frame.
 */
export function BootSkip() {
  useEffect(() => {
    const root = document.documentElement

    const dismiss = () => {
      root.dataset.booted = 'true'
      try {
        sessionStorage.setItem(BOOT_STORAGE_KEY, '1')
      } catch {
        // Modo privado o cookies bloqueadas: el boot se vuelve a ver y punto.
        // No vale la pena degradar nada por esto.
      }
    }

    // Si ya está marcado por el script inline, no hay nada que animar.
    if (root.dataset.booted === 'true') return

    const onKeyDown = (event: KeyboardEvent) => {
      // Enter y barra espaciadora quedan afuera: son teclas de activación y
      // alguien podría estar tipeando en la terminal mientras el boot termina.
      if (event.key === 'Escape' || event.key === 'Tab' || event.key === 'ArrowDown') {
        dismiss()
      }
    }

    window.addEventListener('pointerdown', dismiss, { once: true })
    window.addEventListener('wheel', dismiss, { once: true, passive: true })
    window.addEventListener('keydown', onKeyDown)

    // Red de seguridad: si la animación CSS no corriera (navegador raro,
    // extensión que bloquea animaciones), el overlay igual se va.
    const timer = window.setTimeout(dismiss, 1600)

    return () => {
      window.removeEventListener('pointerdown', dismiss)
      window.removeEventListener('wheel', dismiss)
      window.removeEventListener('keydown', onKeyDown)
      window.clearTimeout(timer)
    }
  }, [])

  return null
}
