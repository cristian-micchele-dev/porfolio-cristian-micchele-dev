import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // El home del usuario tiene su propio package-lock.json y Turbopack lo tomaba
  // como raíz del workspace. Anclamos la raíz a este proyecto.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Los assets del portfolio son estáticos e importados — no hay remotos.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
