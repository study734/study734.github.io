import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { ArrowUp, Bot, Folder, GitBranch, MoreHorizontal, Plus, ShieldCheck, Sparkles } from 'lucide-react'
import { AgentChat, type AgentMessage } from './components/AgentChat'
import { runAgent } from './agent/engine'
import { Header } from './components/Header'
import { ProjectShowcase } from './components/ProjectShowcase'
import { ReviewPane } from './components/ReviewPane'
import { Sidebar, type WorkspaceView } from './components/Sidebar'
import { projects, projectThreads } from './data/projects'
import { Contact } from './sections/Contact'
import { Experience } from './sections/Experience'
import { Stack } from './sections/Stack'
import { WorkConversation } from './components/WorkConversation'
import { answerFollowup, followupQuestions, type Exchange } from './data/conversations'
import { profile } from './data/profile'

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
type CommandTarget = WorkspaceView | 'review'

const projectIndexFromView = (view: WorkspaceView) => {
  const match = view.match(/^project-(\d+)/)
  return match ? Number(match[1]) : null
}

const homeHelper = '포트폴리오 기록을 검색해 답합니다 · / 로 화면 이동'

const commands = [
  { label: '/review 프로젝트 검토', hint: '기여·기술·링크를 리뷰 패널에서 봅니다', target: 'review' as CommandTarget, keywords: '/review 리뷰 review diff 증거' },
  { label: '대표 프로젝트 보기', hint: 'GearVia 프로젝트를 엽니다', target: 'project-0' as CommandTarget, keywords: '대표 프로젝트 gearvia ai rag' },
  { label: '온프레미스 프로젝트', hint: '설치와 운영 경험을 봅니다', target: 'project-1' as CommandTarget, keywords: '온프레미스 on-premise 설치 운영' },
  { label: '협업과 역할 보기', hint: '경험과 기여 내용을 엽니다', target: 'experience' as CommandTarget, keywords: '협업 역할 경험 contribution' },
  { label: '기술 스택 확인', hint: '사용 기술과 강점을 봅니다', target: 'stack' as CommandTarget, keywords: '기술 스택 stack java spring react' },
  { label: '연락하기', hint: 'GitHub와 이메일을 확인합니다', target: 'contact' as CommandTarget, keywords: '연락 contact email github' },
]

export default function App() {
  const [activeView, setActiveView] = useState<WorkspaceView>(() => viewFromHash(window.location.hash))
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [query, setQuery] = useState('')
  const [projectQuestion, setProjectQuestion] = useState('')
  const [sessionReplies, setSessionReplies] = useState<Record<string, Exchange[]>>({})
  const [pendingReply, setPendingReply] = useState<{ view: string; reply: Exchange } | null>(null)
  const [helperText, setHelperText] = useState(homeHelper)
  const [agentMessages, setAgentMessages] = useState<AgentMessage[]>([])
  const agentBusy = agentMessages.some((message) => message.animate)
  const settleAgentMessage = useCallback((id: number) => {
    setAgentMessages((current) => current.map((message) => message.id === id && message.animate ? { ...message, animate: false } : message))
  }, [])
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

  useEffect(() => {
    if (!pendingReply) return
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => {
      setSessionReplies(current => ({ ...current, [pendingReply.view]: [...(current[pendingReply.view] ?? []), pendingReply.reply] }))
      setPendingReply(null)
    }, reducedMotion ? 0 : 900)
    return () => window.clearTimeout(timer)
  }, [pendingReply])

  const askQuestion = (reply: Exchange) => {
    if (!activeThread || pendingReply) return
    setPendingReply({ view: activeView, reply })
    setQuery('')
    setIsCommandOpen(false)
  }

  const addFollowup = (question: string) => {
    if (!activeThread || !question.trim()) return
    askQuestion({ question: question.trim(), answer: answerFollowup(activeThread, question.trim()), stage: '더 알아보기' })
  }

  const toggleSidebar = () => {
    const isMobileViewport = typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 720px)').matches
    if (isMobileViewport) setIsSidebarOpen((open) => !open)
    else setIsSidebarCollapsed((collapsed) => !collapsed)
  }

  const applyView = (view: WorkspaceView, question = '') => {
    setPendingReply(null)
    setActiveView(view)
    setQuery('')
    if (view.startsWith('project-')) {
      setProjectQuestion(question)
      const project = projects[projectIndexFromView(view) ?? -1]
      setHelperText(project ? `${project.name}에 대해 더 질문해보세요` : '선택한 프로젝트에 대해 더 질문해보세요')
    } else if (view !== 'home') {
      setHelperText('선택한 정보를 더 탐색해보세요')
    } else {
      setHelperText(homeHelper)
    }
    setIsSidebarOpen(false)
    setIsCommandOpen(false)
    window.requestAnimationFrame(() => {
      const content = document.querySelector<HTMLElement>('.workspace-content')
      if (content) { content.scrollTop = 0; content.focus({ preventScroll: true }) }
    })
  }

  const navigate = (view: WorkspaceView, question = '') => {
    applyView(view, question)
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
    const projectIndex = projectIndexFromView(activeView)
    const section = activeView === 'experience' ? 'Experience' : activeView === 'stack' ? 'Core Stack' : activeView === 'contact' ? 'Contact' : null
    const label = projectIndex !== null ? projects[projectIndex]?.name : section
    document.title = label ? `${label} · ${profile.name} 포트폴리오` : `${profile.name} | ${profile.role}`
  }, [activeView])

  const askAgent = (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || agentBusy) return
    if (activeView !== 'home') navigate('home')
    setAgentMessages((current) => [...current, { id: Date.now() + current.length, question: trimmed, run: runAgent(trimmed), animate: true }])
    setQuery('')
    setIsCommandOpen(false)
  }

  const filteredCommands = useMemo(() => {
    const normalized = query.trim().toLowerCase().replace(/^\//, '').trim()
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
    if (normalized.startsWith('/')) {
      const commandQuery = normalized.replace(/^\//, '').trim()
      const matched = commands.find(({ label, keywords }) => `${label} ${keywords}`.toLowerCase().includes(commandQuery))
      if (matched) runCommand(matched.target, matched.label)
      else { setHelperText('일치하는 화면이 없습니다. / 없이 입력하면 agent에게 물어볼 수 있어요'); setQuery('') }
      return
    }
    if (activeThread) {
      addFollowup(submittedQuestion)
      return
    }
    askAgent(submittedQuestion)
  }

  const isDetailComposer = activeView !== 'home'
  const composerPlaceholder = activeProject
    ? `${activeProject.project.name}에 대해 agent에게 물어보세요`
    : '임태욱에 대해 무엇이든 물어보세요'
  const isCommandMenuVisible = isCommandOpen && query.trimStart().startsWith('/')

  return (
    <div className="portfolio-app">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')}
        isReviewOpen={isReviewOpen}
        onToggleReview={() => setIsReviewOpen((open) => !open)}
        onOpenContact={() => navigate('contact')}
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
          {activeThread && <header className="conversation-titlebar" aria-label="현재 대화">
            <span><Folder aria-hidden="true" /><strong>{activeThread.title}</strong></span>
            <button type="button" aria-label="대화 메뉴"><MoreHorizontal /></button>
          </header>}
          <section className={`workspace-content ${activeProject ? 'is-project-thread' : ''} ${activeThread ? 'has-conversation' : ''}`} tabIndex={-1}>
            {activeView === 'home' && <AgentChat messages={agentMessages} onAsk={askAgent} onNavigate={navigate} onSettled={settleAgentMessage} busy={agentBusy} />}

            {activeThread ? <WorkConversation key={activeView} thread={activeThread} replies={sessionReplies[activeView] ?? []} pending={pendingReply?.view === activeView ? pendingReply.reply : null} onAsk={askQuestion} onOpenReview={() => setIsReviewOpen(true)} /> : activeProject && <ProjectShowcase project={activeProject.project} index={activeProject.index} question={projectQuestion} onOpenReview={() => setIsReviewOpen(true)} />}
            {activeView === 'experience' && <Experience />}
            {activeView === 'stack' && <Stack />}
            {activeView === 'contact' && <Contact />}
          </section>

          <div className={`composer-dock ${isDetailComposer ? 'is-detail-composer' : ''} ${activeThread ? 'is-conversation-composer' : ''}`}>
            {activeThread && <div className="conversation-followups" aria-label="추천 후속 질문">
              {followupQuestions.map(question => <button type="button" key={question} disabled={!!pendingReply} onClick={() => addFollowup(question)}>{question}</button>)}
            </div>}
            {isCommandMenuVisible && (
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
              <span><Bot aria-hidden="true" /> 임태욱 agent</span>
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
                placeholder={activeThread ? '선택 이유·한계·담당 역할을 물어보세요' : composerPlaceholder}
                autoComplete="off"
                aria-expanded={isCommandMenuVisible}
                aria-controls="portfolio-command-menu"
              />
              <div className="composer-footer">
                {isDetailComposer
                  ? <button className="composer-context-action" type="button" onClick={() => document.getElementById('portfolio-query')?.focus()}><Plus aria-hidden="true" /><span>{activeProject ? '프로젝트 질문' : '선택 항목 질문'}</span></button>
                  : <span>{helperText}</span>}
                <button type="submit" aria-label="탐색하기" disabled={!query.trim() || !!pendingReply || (agentBusy && !activeThread && !query.trimStart().startsWith('/'))}><ArrowUp aria-hidden="true" /></button>
              </div>
            </form>
          </div>
        </main>
        <ReviewPane project={activeProject?.project ?? null} isOpen={isReviewOpen} onClose={() => setIsReviewOpen(false)} />
      </div>
    </div>
  )
}
