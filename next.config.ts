import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Los assets del portfolio son estáticos e importados — no hay remotos.
    formats: ['image/avif', 'image/webp'],
  },
}

export default nextConfig
