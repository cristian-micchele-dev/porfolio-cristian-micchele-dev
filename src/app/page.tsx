import { Hero } from '@/sections/Hero'
import { Projects } from '@/sections/Projects'
import { Stack } from '@/sections/Stack'
import { Architecture } from '@/sections/Architecture'
import { AI } from '@/sections/AI'
import { Timeline } from '@/sections/Timeline'
import { Contact } from '@/sections/Contact'

/**
 * El orden debe coincidir con `src/data/sections.ts`, que es lo que lee el
 * rail y el scroll spy. `src/data/content.test.ts` lo verifica.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Projects />
      <Stack />
      <Architecture />
      <AI />
      <Timeline />
      <Contact />
    </>
  )
}
