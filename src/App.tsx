import { Header } from './components/Header'
import { About } from './sections/About'
import { Achievements } from './sections/Achievements'
import { Contact } from './sections/Contact'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Skills } from './sections/Skills'

export default function App() {
  return (
    <div className="page-shell">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Achievements />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© 2026 TW</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  )
}
