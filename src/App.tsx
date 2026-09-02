import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { ArrowUp, BriefcaseBusiness, Code2, Folder, GitBranch, MoreHorizontal, Plus, Sparkles } from 'lucide-react'
import { Header } from './components/Header'
import { ProjectShowcase } from './components/ProjectShowcase'
import { ReviewPane } from './components/ReviewPane'
import { Sidebar, type WorkspaceView } from './components/Sidebar'
import { projects, projectThreads } from './data/projects'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'

const quickActions = [
  { label: '대표 프로젝트 보기', view: 'project-0' as WorkspaceView, icon: BriefcaseBusiness },
  { label: 'AI · RAG 경험 보기', view: 'project-0' as WorkspaceView, icon: Sparkles },
  { label: '협업과 역할 보기', view: 'experience' as WorkspaceView, icon: Code2 },
  { label: '기술 스택 확인하기', view: 'stack' as WorkspaceView, icon: Code2 },
]

export type Theme = 'dark' | 'light'
type CommandTarget = WorkspaceView | 'review'

const projectIndexFromView = (view: WorkspaceView) => {
  const match = view.match(/^project-(\d+)/)
  return match ? Number(match[1]) : null
}

const commands = [
  { label: '/review 프로젝트 검토', hint: '기여·기술·링크를 리뷰 패널에서 봅니다', target: 'review' as CommandTarget, keywords: '/review 리뷰 review diff 증거' },
  { label: '대표 프로젝트 보기', hint: 'GearVia 프로젝트를 엽니다', target: 'project-0' as CommandTarget, keywords: '대표 프로젝트 gearvia ai rag' },
  { label: '온프레미스 프로젝트', hint: '설치와 운영 경험을 봅니다', target: 'project-1' as CommandTarget, keywords: '온프레미스 on-premise 설치 운영' },
  { label: '협업과 역할 보기', hint: '경험과 기여 내용을 엽니다', target: 'experience' as CommandTarget, keywords: '협업 역할 경험 contribution' },
  { label: '기술 스택 확인', hint: '사용 기술과 강점을 봅니다', target: 'stack' as CommandTarget, keywords: '기술 스택 stack java spring react' },
  { label: '연락하기', hint: 'GitHub와 이메일을 확인합니다', target: 'contact' as CommandTarget, keywords: '연락 contact email github' },
]

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>('home')
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [projectQuestion, setProjectQuestion] = useState('')
  const [helperText, setHelperText] = useState('프로젝트와 경험을 탐색해보세요')
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem('portfolio-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const activeProject = useMemo(() => {
    const projectIndex = projectIndexFromView(activeView)
    if (projectIndex === null) return null
    return projects[projectIndex] ? { project: projects[projectIndex], index: projectIndex } : null
  }, [activeView])

  const activeThread = useMemo(() => {
    const match = activeView.match(/^project-(\d+)-thread-(\d+)$/)
    if (!match) return null
    return projectThreads[Number(match[1])]?.[Number(match[2])] ?? null
  }, [activeView])

  const toggleSidebar = () => {
    const isMobileViewport = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 720px)').matches
    if (isMobileViewport) setIsSidebarOpen((open) => !open)
    else setIsSidebarCollapsed((collapsed) => !collapsed)
  }

  const navigate = (view: WorkspaceView, question = '') => {
    setActiveView(view)
    if (view.startsWith('project-')) {
      setProjectQuestion(question)
      const project = projects[projectIndexFromView(view) ?? -1]
      setHelperText(project ? `${project.name}에 대해 더 질문해보세요` : '선택한 프로젝트에 대해 더 질문해보세요')
    } else if (view !== 'home') {
      setHelperText('선택한 정보를 더 탐색해보세요')
    } else {
      setHelperText('프로젝트와 경험을 탐색해보세요')
    }
    setIsSidebarOpen(false)
    setIsCommandOpen(false)
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>('.workspace-content')?.focus())
  }

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return commands.slice(0, 4)
    return commands.filter(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(normalized)).slice(0, 4)
  }, [query])

  const runCommand = (target: CommandTarget, label: string) => {
    if (target === 'review') {
      setIsReviewOpen(true)
      setIsCommandOpen(false)
    } else {
      navigate(target)
      if (target.startsWith('project-')) setProjectQuestion(label)
    }
    setHelperText(`“${label}” 화면을 열었습니다`)
    setQuery('')
  }

  const submitQuery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalized = query.trim().toLowerCase()
    if (!normalized) return

    const submittedQuestion = query.trim()
    const matched = commands.find(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(normalized))
    if (matched) runCommand(matched.target, matched.label)
    else if (normalized.includes('기술') || normalized.includes('stack')) navigate('stack')
    else if (normalized.includes('경험') || normalized.includes('협업') || normalized.includes('역할')) navigate('experience')
    else if (normalized.includes('연락') || normalized.includes('contact')) navigate('contact')
    else if (normalized.includes('온프레미스') || normalized.includes('on-premise')) navigate('project-1')
    else if (normalized.includes('me') || normalized.includes('개인')) navigate('project-2')
    else if (normalized.includes('moida') || normalized.includes('경매')) navigate('project-3')
    else navigate('project-0')

    if (!matched) {
      const targetView = normalized.includes('온프레미스') || normalized.includes('on-premise')
        ? 'project-1'
        : normalized.includes('me') || normalized.includes('개인')
          ? 'project-2'
          : normalized.includes('moida') || normalized.includes('경매')
            ? 'project-3'
            : 'project-0'
      if (!['stack', 'experience', 'contact'].includes(activeView) || targetView.startsWith('project-')) setProjectQuestion(submittedQuestion)
      setHelperText(`“${submittedQuestion}”에 가장 가까운 답변을 만들었습니다`)
    }
    setQuery('')
  }

  const isDetailComposer = activeView !== 'home'
  const composerPlaceholder = activeProject
    ? `${activeProject.project.name}에 대해 더 질문해보세요`
    : isDetailComposer
      ? '선택한 항목에 대해 더 질문해보세요'
      : '프로젝트나 경험을 입력해보세요'
  const conversationTitle = activeThread?.title ?? activeProject?.project.name ?? 'Portfolio overview'

  return (
    <div className="portfolio-app">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        isReviewOpen={isReviewOpen}
        onToggleReview={() => setIsReviewOpen((open) => !open)}
      />
      <div className={`workspace-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''} ${isReviewOpen ? 'has-review' : ''}`}>
        <Sidebar
          activeView={activeView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        />

        <main className="workspace-main">
          <header className="conversation-titlebar" aria-label="현재 대화">
            <span><Folder aria-hidden="true" /><strong>{conversationTitle}</strong></span>
            <button type="button" aria-label="대화 메뉴"><MoreHorizontal /></button>
          </header>
          <section className={`workspace-content ${activeProject ? 'is-project-thread' : ''}`} tabIndex={-1} aria-live="polite">
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

            {activeProject && <ProjectShowcase project={activeProject.project} index={activeProject.index} question={projectQuestion} thread={activeThread} onOpenReview={() => setIsReviewOpen(true)} />}
            {activeView === 'experience' && <Experience />}
            {activeView === 'stack' && <Stack />}
            {activeView === 'contact' && <Contact />}
          </section>

          <div className={`composer-dock ${isDetailComposer ? 'is-detail-composer' : ''}`}>
            {isCommandOpen && (
              <div className="command-menu" id="portfolio-command-menu" role="listbox" aria-label="탐색 명령">
                <div className="command-menu-heading"><span>빠른 탐색</span><kbd>ESC</kbd></div>
                {filteredCommands.length > 0 ? filteredCommands.map((command) => (
                  <button type="button" role="option" aria-selected="false" key={command.label} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand(command.target, command.label)}>
                    <Sparkles aria-hidden="true" />
                    <span><strong>{command.label}</strong><small>{command.hint}</small></span>
                    <span className="command-enter">↵</span>
                  </button>
                )) : <p className="command-empty">일치하는 명령이 없습니다. Enter를 누르면 가장 가까운 프로젝트를 엽니다.</p>}
              </div>
            )}
            {!isDetailComposer && <div className="workspace-context" aria-label="현재 포트폴리오 정보">
              <span><BriefcaseBusiness aria-hidden="true" /> Portfolio</span>
              <span><Code2 aria-hidden="true" /> Product-minded</span>
              <a href="https://github.com/study734" target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /> study734</a>
            </div>}
            <form className="command-composer" onSubmit={submitQuery}>
              <label className="sr-only" htmlFor="portfolio-query">포트폴리오 탐색</label>
              <input
                id="portfolio-query"
                value={query}
                onChange={(event) => { setQuery(event.target.value); setIsCommandOpen(true) }}
                onFocus={() => setIsCommandOpen(true)}
                onBlur={() => window.setTimeout(() => setIsCommandOpen(false), 100)}
                onKeyDown={(event) => { if (event.key === 'Escape') setIsCommandOpen(false) }}
                placeholder={composerPlaceholder}
                autoComplete="off"
                aria-expanded={isCommandOpen}
                aria-controls="portfolio-command-menu"
              />
              <div className="composer-footer">
                {isDetailComposer
                  ? <button className="composer-context-action" type="button" onClick={() => document.getElementById('portfolio-query')?.focus()}><Plus aria-hidden="true" /><span>{activeProject ? '프로젝트 질문' : '선택 항목 질문'}</span></button>
                  : <span>{helperText}</span>}
                <button type="submit" aria-label="탐색하기" disabled={!query.trim()}><ArrowUp aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </main>
        <ReviewPane project={activeProject?.project ?? null} isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      </div>
    </div>
  )
}
