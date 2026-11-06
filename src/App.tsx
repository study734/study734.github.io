import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Bot, GitBranch, ShieldCheck, Sparkles } from 'lucide-react'
import { audienceOptions, runAgent, tourFor, type Audience } from './agent/engine'
import { AgentChat, type AgentMessage } from './components/AgentChat'
import { Header } from './components/Header'
import { ProjectShowcase } from './components/ProjectShowcase'
import { Sidebar, type WorkspaceView } from './components/Sidebar'
import { WorkConversation } from './components/WorkConversation'
import { profile } from './data/profile'
import { projects, projectThreads } from './data/projects'
import { trackEvent } from './lib/analytics'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'

/** URL 해시(#/project-0 등)와 화면을 맞춰서, 특정 프로젝트 링크를 그대로 공유할 수 있게 합니다. */
const viewFromHash = (hash: string): WorkspaceView => {
  const value = decodeURIComponent(hash.replace(/^#\/?/, ''))
  if (value === 'experience' || value === 'stack' || value === 'contact') return value
  const thread = value.match(/^project-(\d+)-thread-(\d+)$/)
  if (thread && projectThreads[Number(thread[1])]?.[Number(thread[2])]) return value as WorkspaceView
  const project = value.match(/^project-(\d+)$/)
  if (project && projects[Number(project[1])]) return value as WorkspaceView
  return 'home'
}
const hashFromView = (view: WorkspaceView) => (view === 'home' ? '#/' : `#/${view}`)

export type Theme = 'dark' | 'light'

const projectIndexFromView = (view: WorkspaceView) => {
  const match = view.match(/^project-(\d+)/)
  return match ? Number(match[1]) : null
}

const homeHelper = '정리된 기록을 근거로 답해요 · / 로 화면 이동'

const commands: { label: string; hint: string; target: WorkspaceView; keywords: string }[] = [
  { label: '비서와 대화', hint: '첫 화면으로 돌아갑니다', target: 'home', keywords: '비서 agent 홈 home 대화' },
  ...projects.map((project, index) => ({ label: project.name, hint: project.subtitle, target: `project-${index}` as WorkspaceView, keywords: `프로젝트 project ${project.name} ${project.technologies.join(' ')}` })),
  { label: '경험', hint: '학력과 활동 기록', target: 'experience', keywords: '경험 experience 학력 협업 역할' },
  { label: '기술 스택', hint: '사용 기술과 쓰임새', target: 'stack', keywords: '기술 스택 stack java spring react' },
  { label: '연락처', hint: '이메일과 GitHub', target: 'contact', keywords: '연락 contact email github 메일' },
]

const newId = (() => { let id = 0; return () => ++id })()

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>(() => viewFromHash(window.location.hash))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [helperText, setHelperText] = useState(homeHelper)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const agentBusy = agentMessages.some((message) => message.animate)
  const settleAgentMessage = useCallback((id: number) => {
    setAgentMessages((current) => current.map((message) => message.id === id && message.animate ? { ...message, animate: false } : message))
  }, [])
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const savedTheme = window.localStorage.getItem('portfolio-theme')
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    } catch { /* 저장소를 쓸 수 없는 환경에서는 시스템 설정을 따릅니다 */ }
    return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try { window.localStorage.setItem('portfolio-theme', theme) } catch { /* 무시 */ }
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

  const applyView = (view: WorkspaceView) => {
    setActiveView(view)
    setQuery('')
    setHelperText(homeHelper)
    setIsSidebarOpen(false)
    setIsCommandOpen(false)
    window.requestAnimationFrame(() => {
      const content = document.querySelector<HTMLElement>('.workspace-content')
      if (content) { content.scrollTop = 0; content.focus({ preventScroll: true }) }
    })
  }

  const navigate = (view: WorkspaceView) => {
    applyView(view)
    if (window.location.hash !== hashFromView(view)) window.history.pushState(null, '', hashFromView(view))
  }

  const applyViewRef = useRef(applyView)
  applyViewRef.current = applyView

  useEffect(() => {
    const syncFromUrl = () => applyViewRef.current(viewFromHash(window.location.hash))
    window.addEventListener('popstate', syncFromUrl)
    return () => window.removeEventListener('popstate', syncFromUrl)
  }, [])

  useEffect(() => {
    const focusComposer = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = target?.closest('input, textarea, [contenteditable="true"]')
      if (event.key === '/' && !isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault()
        document.getElementById('portfolio-query')?.focus()
      }
    }
    document.addEventListener('keydown', focusComposer)
    return () => document.removeEventListener('keydown', focusComposer)
  }, [])

  useEffect(() => {
    const section = activeView === 'experience' ? 'Experience' : activeView === 'stack' ? 'Core Stack' : activeView === 'contact' ? 'Contact' : null
    const label = activeThread?.title ?? activeProject?.project.name ?? section
    document.title = label ? `${label} · ${profile.name} 포트폴리오` : `${profile.name} | ${profile.role}`
  }, [activeView, activeProject, activeThread])

  const askAgent = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || agentBusy) return
    const contextProject = activeProject?.project.name
    const run = runAgent(trimmed, contextProject)
    if (activeView !== 'home') navigate('home')
    setAgentMessages((current) => [...current, { id: newId(), question: trimmed, run, animate: true }])
    setQuery('')
    setIsCommandOpen(false)
    trackEvent('ask', { intent: run.intent, answered: run.intent !== 'unknown' })
    if (run.intent === 'unknown') trackEvent('unanswered', { question: trimmed.slice(0, 120) })
  }

  const chooseAudience = (audience: Audience) => {
    if (agentBusy) return
    const option = audienceOptions.find((item) => item.id === audience)
    if (!option) return
    setAgentMessages((current) => [...current, { id: newId(), question: option.question, run: tourFor(audience), animate: true }])
    trackEvent('audience', { audience })
  }

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^\//, '').trim()
    if (!normalized) return commands.slice(0, 5)
    return commands.filter(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(normalized)).slice(0, 5)
  }, [query])

  const runCommand = (target: WorkspaceView) => {
    navigate(target)
    setQuery('')
  }

  const submitQuery = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitted = query.trim()
    if (!submitted) return
    if (submitted.startsWith('/')) {
      const commandQuery = submitted.toLowerCase().replace(/^\//, '').trim()
      const matched = commands.find(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(commandQuery))
      if (matched) runCommand(matched.target)
      else { setHelperText('일치하는 화면이 없어요. / 없이 입력하면 비서에게 물어볼 수 있어요'); setQuery('') }
      return
    }
    askAgent(submitted)
  }

  const isHome = activeView === 'home'
  const composerPlaceholder = activeProject ? `${activeProject.project.name}에 대해 비서에게 물어보세요` : '비서에게 태욱 님에 대해 물어보세요'
  const isCommandMenuVisible = isCommandOpen && query.trimStart().startsWith('/')
  const isSlash = query.trimStart().startsWith('/')

  return (
    <div className="portfolio-app">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        onOpenContact={() => navigate('contact')}
      />
      <div className={`workspace-layout ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar
          activeView={activeView}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        />

        <main className="workspace-main">
          <section className={`workspace-content ${isHome ? '' : 'is-page'}`} tabIndex={-1}>
            {isHome && <AgentChat messages={agentMessages} onAsk={askAgent} onNavigate={navigate} onSettled={settleAgentMessage} onChooseAudience={chooseAudience} busy={agentBusy} />}
            {activeThread && activeProject
              ? <WorkConversation key={activeView} thread={activeThread} projectName={activeProject.project.name} onAsk={askAgent} />
              : activeProject && <ProjectShowcase key={activeView} project={activeProject.project} index={activeProject.index} threads={projectThreads[activeProject.index]} onNavigate={navigate} onAsk={askAgent} />}
            {activeView === 'experience' && <Experience />}
            {activeView === 'stack' && <Stack />}
            {activeView === 'contact' && <Contact />}
          </section>

          <div className={`composer-dock ${isHome ? '' : 'is-detail-composer'}`}>
            {isCommandMenuVisible && (
              <div className="command-menu" id="portfolio-command-menu" role="listbox" aria-label="탐색 명령">
                <div className="command-menu-heading"><span>화면 이동</span><kbd>ESC</kbd></div>
                {filteredCommands.length > 0 ? filteredCommands.map((command) => (
                  <button type="button" role="option" aria-selected="false" key={command.label} onMouseDown={(event) => event.preventDefault()} onClick={() => runCommand(command.target)}>
                    <Sparkles aria-hidden="true" />
                    <span><strong>{command.label}</strong><small>{command.hint}</small></span>
                    <span className="command-enter">↵</span>
                  </button>
                )) : <p className="command-empty">일치하는 화면이 없어요. / 없이 입력하면 비서에게 물어볼 수 있어요.</p>}
              </div>
            )}
            {isHome && <div className="workspace-context" aria-label="현재 포트폴리오 정보">
              <span><Bot aria-hidden="true" /> 태욱 님의 비서</span>
              <span><ShieldCheck aria-hidden="true" /> 기록 기반 답변</span>
              <a href={profile.githubUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" /> {profile.githubHandle}</a>
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
                maxLength={300}
                aria-expanded={isCommandMenuVisible}
                aria-controls="portfolio-command-menu"
              />
              <div className="composer-footer">
                <span>{helperText}</span>
                <button type="submit" aria-label="탐색하기" disabled={!query.trim() || (agentBusy && !isSlash)}><ArrowUp aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}
