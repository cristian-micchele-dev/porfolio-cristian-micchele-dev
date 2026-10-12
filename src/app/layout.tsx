import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { StatusBar } from '@/components/shell/StatusBar'
import { SectionRail } from '@/components/shell/SectionRail'
import { GridField } from '@/components/shell/GridField'
import { LogFooter } from '@/components/shell/LogFooter'
import { ActiveSectionProvider } from '@/components/shell/ActiveSectionProvider'
import { SystemHealthProvider } from '@/components/shell/SystemHealthProvider'
import { BootSequence } from '@/components/BootSequence'
import { BOOT_STORAGE_KEY } from '@/lib/boot'
import { profile } from '@/data/profile'
import { SITE_URL } from '@/lib/site'
import './globals.css'

/* Self-hosted por next/font: cero request a Google, cero CLS. DESIGN.md §4 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})


/**
 * Marca el boot como visto ANTES del primer paint.
 *
 * Tiene que ser un script inline y bloqueante: si esperáramos a React, quien
 * recarga la página vería la secuencia otra vez durante un frame. Es el mismo
 * patrón que se usa para evitar el flash de tema.
 */
const BOOT_FLAG_SCRIPT = `try{if(sessionStorage.getItem('${BOOT_STORAGE_KEY}'))document.documentElement.dataset.booted='true'}catch(e){}`

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.role}, ${profile.specialization}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.summary,
  keywords: [
    'Full Stack Developer',
    'Backend Developer',
    'NestJS',
    'Node.js',
    'TypeScript',
    'PostgreSQL',
    'React',
    'Next.js',
    'Arquitectura Hexagonal',
    'Clean Architecture',
    profile.name,
  ],
  authors: [{ name: profile.name, url: profile.github }],
  creator: profile.name,
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: `${profile.name} — AI Console`,
    title: `${profile.name} — ${profile.role}`,
    description: profile.summary,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${profile.name} — ${profile.role}`,
    description: profile.summary,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
}

export const viewport: Viewport = {
  themeColor: '#08090c',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // `suppressHydrationWarning` sólo acá, y sólo por el atributo `data-booted`:
    // el script inline de abajo lo escribe ANTES de que React hidrate, así que
    // el cliente ve un atributo que no estaba en el HTML del servidor. Es
    // intencional — es la única forma de evitar el flash del boot al recargar.
    // El flag alcanza al elemento y a sus atributos, no a los descendientes,
    // así que no tapa ningún otro problema de hidratación.
    <html
      lang="es"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_FLAG_SCRIPT }} />
      </head>
      <body>
        <a
          href="#identity"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-panel focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-fg"
        >
          Saltar al contenido
        </a>

        <GridField />

        {/* Un IntersectionObserver y un fetch de health para toda la app */}
        <ActiveSectionProvider>
          <SystemHealthProvider>
            <StatusBar />
            <SectionRail />

            <main className="pt-12">{children}</main>

            <LogFooter />
          </SystemHealthProvider>
        </ActiveSectionProvider>

        {/* Último en el DOM: es un overlay sobre contenido ya renderizado */}
        <BootSequence />
      </body>
    </html>
  )
}
