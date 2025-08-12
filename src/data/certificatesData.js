import NestCert from '../assets/images/certificates/Nest.jpg'
import DockerCert from '../assets/images/certificates/Fundamentos-Docker.jpg'
import CertificadoHtmlCss from '../assets/images/certificates/CertificadoP-htmlcss.JPG'



export const certificates = [
  {
    id: 1,
    title: "Docker: Fundamentos",
    issuer: "Platzi",
    image: DockerCert,
    credentialUrl: "https://platzi.com/@cristian.aiki1",
    category: "DevOps",
    year: "2025",
    skills: ["Docker", "Containers", "DevOps"]
  },
  {
    id: 2,
    title: "Nest: Desarrollo backend escalable con Node",
    issuer: "Udemy",
    image: NestCert,
    credentialUrl: "https://www.udemy.com/certificate/UC-b1ea7c0a-7115-4fc3-83aa-88db4735c8c2/",
    category: "Backend",
    year: "2025",
    skills: ["NestJS", "Node.js", "TypeScript"]
  },
  {
    id: 3,
    title: "HTML y CSS",
    issuer: "Platzi",
    image: CertificadoHtmlCss,
    credentialUrl: "https://platzi.com/@cristian.aiki1",
    category: "Frontend",
    year: "2022",
    skills: ["HTML", "CSS", "Web Design"]
  }
]

export const certificatesConfig = {
  title: "Certificaciones",
  subtitle: "Certificaciones que respaldan mi formación profesional",
  gridCols: "md:grid-cols-2 lg:grid-cols-3",
  showYear: true,
  showSkills: false,
  showCategory: false
}