import { useMemo, useState, type FormEvent } from 'react'
import { ArrowUp, BriefcaseBusiness, Code2, GitBranch, Sparkles } from 'lucide-react'
import { Header } from './components/Header'
import { ProjectShowcase } from './components/ProjectShowcase'
import { Sidebar, type WorkspaceView } from './components/Sidebar'
import { projects } from './data/projects'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'

const quickActions = [
  { label: '대표 프로젝트 보기', view: 'project-0' as WorkspaceView, icon: BriefcaseBusiness },
  { label: 'AI · RAG 경험 보기', view: 'project-0' as WorkspaceView, icon: Sparkles },
  { label: '협업과 역할 보기', view: 'experience' as WorkspaceView, icon: Code2 },
  { label: '기술 스택 확인하기', view: 'stack' as WorkspaceView, icon: Code2 },
]

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [helperText, setHelperText] = useState('프로젝트와 경험을 탐색해보세요')

  const activeProject = useMemo(() => {
    if (!activeView.startsWith('project-')) return null
    const projectIndex = Number(activeView.replace('project-', ''))
    return projects[projectIndex] ? { project: projects[projectIndex], index: projectIndex } : null
  }, [activeView])

  const navigate = (view: WorkspaceView) => {
    setActiveView(view)
    setIsSidebarOpen(false)
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('.workspace-content')?.focus())
  }

  const submitQuery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = query.trim().toLowerCase()
    if (!normalized) return

    if (normalized.includes('기술') || normalized.includes('stack')) navigate('stack')
    else if (normalized.includes('경험') || normalized.includes('협업') || normalized.includes('역할')) navigate('experience')
    else if (normalized.includes('연락') || normalized.includes('contact')) navigate('contact')
    else if (normalized.includes('온프레미스') || normalized.includes('on-premise')) navigate('project-1')
    else if (normalized.includes('me') || normalized.includes('개인')) navigate('project-2')
    else if (normalized.includes('moida') || normalized.includes('경매')) navigate('project-3')
    else navigate('project-0')

    setHelperText(`“${query.trim()}”에 가장 가까운 내용을 열었습니다`)
    setQuery('')
  }

  return (
    <div className="portfolio-app">
      <Header onOpenSidebar={() => setIsSidebarOpen(true)} />
      <div className="workspace-layout">
        <Sidebar activeView={activeView} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onNavigate={navigate} />

        <main className="workspace-main">
          <section className="workspace-content" tabIndex={-1} aria-live="polite">
            {activeView === 'home' && (
              <div className="home-view">
                <div className="home-mark" aria-hidden="true"><Sparkles /></div>
                <p className="eyebrow">SOFTWARE ENGINEER · PORTFOLIO 2026</p>
                <h1>임태욱은 무엇을<br />만들어왔을까요?</h1>
                <p className="home-description">
                  문제를 구조화하고 동작하는 제품으로 연결합니다.<br />
                  Backend, Security, AI · RAG를 넘나든 프로젝트 기록입니다.
                </p>

                <div className="quick-actions" aria-label="추천 탐색 경로">
                  {quickActions.map(({ label, view, icon: Icon }) => (
                    <button type="button" key={label} onClick={() => navigate(view)}>
                      <Icon aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeProject && <ProjectShowcase project={activeProject.project} index={activeProject.index} />}
            {activeView === 'experience' && <Experience />}
            {activeView === 'stack' && <Stack />}
            {activeView === 'contact' && <Contact />}
          </section>

          <div className="composer-dock">
            <div className="workspace-context" aria-label="현재 포트폴리오 정보">
              <span><BriefcaseBusiness aria-hidden="true" /> Portfolio</span>
              <span><Code2 aria-hidden="true" /> Product-minded</span>
              <a href="https://github.com/study734" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /> study734</a>
            </div>
            <form className="command-composer" onSubmit={submitQuery}>
              <label className="sr-only" htmlFor="portfolio-query">포트폴리오 탐색</label>
              <input id="portfolio-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="예: AI 프로젝트, 협업 경험, 기술 스택" />
              <div className="composer-footer">
                <span>{helperText}</span>
                <button type="submit" aria-label="탐색하기" disabled={!query.trim()}><ArrowUp aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
