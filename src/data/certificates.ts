import dockerCert from '@/assets/images/certificates/docker-fundamentos.jpg'
import nestCert from '@/assets/images/certificates/nestjs.jpg'
import nodeCert from '@/assets/images/certificates/nodejs.jpg'
import type { Certificate } from '@/types/content'

/**
 * Van embebidos dentro de la sección Stack como `verified modules`.
 * No merecen sección propia: son refuerzo del stack, no contenido principal.
 */
export const certificates: readonly Certificate[] = [
  {
    id: 'nest-udemy',
    title: 'NestJS: Desarrollo backend escalable con Node',
    issuer: 'Udemy',
    year: '2025',
    category: 'Backend',
    skills: ['NestJS', 'Node.js', 'TypeScript'],
    credentialUrl:
      'https://www.udemy.com/certificate/UC-b1ea7c0a-7115-4fc3-83aa-88db4735c8c2/',
    image: nestCert,
  },
  {
    id: 'node-devtalles',
    title: 'Node.js',
    issuer: 'DevTalles',
    year: '2025',
    category: 'Backend',
    skills: ['Node.js', 'JavaScript', 'TypeScript'],
    credentialUrl: 'https://cursos.devtalles.com/certificates/h0xwdo9dxc',
    image: nodeCert,
  },
  {
    id: 'docker-platzi',
    title: 'Docker: Fundamentos',
    issuer: 'Platzi',
    year: '2025',
    category: 'DevOps',
    skills: ['Docker', 'Containers'],
    credentialUrl: 'https://platzi.com/@cristian.aiki1',
    image: dockerCert,
  },
] as const
