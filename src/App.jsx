import Header from './components/Header'
import Home from './pages/Home'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'

function App() {
  return (
    <>
      {/* Canvas neuronal fijo en z-index 0 */}
      <AnimatedBackground />
      {/* Contenido en z-index 1, encima del canvas */}
      <div className="min-h-screen relative" style={{ zIndex: 1 }}>
        <Header />
        <Home />
        <Footer />
      </div>
    </>
  )
}

export default App
