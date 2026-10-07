import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { StatusBar } from '@/components/shell/StatusBar'
import { SectionRail } from '@/components/shell/SectionRail'
import { GridField } from '@/components/shell/GridField'
import { profile } from '@/data/profile'
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

const SITE_URL = 'https://cristianmicchele.dev'

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
}

export const viewport: Viewport = {
  themeColor: '#08090c',
  colorScheme: 'dark',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#identity"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-panel focus:border focus:border-accent focus:bg-surface focus:px-4 focus:py-2 focus:font-mono focus:text-sm focus:text-fg"
        >
          Saltar al contenido
        </a>

        <GridField />
        <StatusBar />
        <SectionRail />

        <main className="pt-12">{children}</main>
      </body>
    </html>
  )
}
