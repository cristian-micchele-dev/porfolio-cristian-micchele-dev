import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

/* jsdom no implementa matchMedia, y framer-motion lo usa en useReducedMotion. */
if (!window.matchMedia) {
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia
}

/* Tampoco implementa scrollIntoView, que usan los comandos con `navigate`. */
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn()
}

/**
 * Ni IntersectionObserver, que usan `whileInView` de framer-motion y
 * `useActiveSection`. El stub reporta intersección inmediata para que los
 * componentes se comporten como si estuvieran en viewport, que es el estado
 * que queremos ejercitar en los tests.
 */
// Sin `implements IntersectionObserver`: la interface de lib.dom agrega
// miembros nuevos entre versiones (scrollMargin, etc.) y mantener el stub al
// día no aporta nada a los tests.
class IntersectionObserverStub {
  readonly root = null
  readonly rootMargin = ''
  readonly thresholds: readonly number[] = [0]

  constructor(private readonly callback: IntersectionObserverCallback) {}

  observe(target: Element) {
    queueMicrotask(() => {
      this.callback(
        [
          {
            target,
            isIntersecting: true,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRect: target.getBoundingClientRect(),
            rootBounds: null,
            time: 0,
          } as IntersectionObserverEntry,
        ],
        this as unknown as IntersectionObserver,
      )
    })
  }

  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

globalThis.IntersectionObserver ??=
  IntersectionObserverStub as unknown as typeof IntersectionObserver
