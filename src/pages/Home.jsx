import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Experience from "../components/Experience";
import ProjectsSection from "../components/ProjectsSection";
import Certificates from "../components/Certificates";
import Contact from "../components/Contact";
import { projectSections } from "../data/sectionsData";

// El espaciado vertical lo aporta cada sección con su propio py-16, así que
// entre dos secciones adyacentes ya hay 128px. No van divs separadores acá.
function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <Hero />

      <About />

      <Skills />

      <Experience />

      <div id="proyectos">
        {projectSections.map((section, index) => (
          <ProjectsSection key={section.id || index} {...section} />
        ))}
      </div>

      <section id="certificados">
        <Certificates />
      </section>

      <Contact />
    </div>
  );
}

export default Home;
