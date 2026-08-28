import { Header } from './components/Header'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Intro } from './sections/Intro'
import { Projects } from './sections/Projects'
import { Stack } from './sections/Stack'

export default function App() {
  return (
    <div className="page-shell">
      <Header />
      <main>
        <Intro />
        <Projects />
        <Experience />
        <Stack />
        <Contact />
      </main>
      <footer className="site-footer">
        <span>© 2026 TW</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </div>
  )
}
