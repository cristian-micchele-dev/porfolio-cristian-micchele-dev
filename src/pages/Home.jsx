
import Hero from '../components/Hero'
import About from '../components/About'
import Skills from '../components/Skills'
import ProjectsSection from '../components/ProjectsSection'
import Certificates from '../components/Certificates'
import Contact from '../components/Contact'
import { projectSections } from '../data/sectionsData' // ← Importar desde sectionsData

function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <Hero />
      
      <div className="py-16"></div>
      <About />
      
      {/* Sección de Skills */}
      <div className="py-12"></div>
      <Skills />
      
      <div className="py-12"></div>
      
      {/* Secciones de proyectos */}
      {projectSections.map((section, index) => (
        <div key={section.id || index}>
          <ProjectsSection {...section} />
          {index < projectSections.length - 1 && <div className="py-12"></div>}
        </div>
      ))}
      
      <div className="py-16"></div>
      <section id="certificados">
        <Certificates />
      </section>
      
      <div className="py-16"></div>
      <Contact />
    </div>
  )
}

export default Home