import { useEffect, useRef, useState } from 'react'
import { BookOpenText, BriefcaseBusiness, ChevronRight, CircleHelp, FileText, Folder, GitBranch, Home, Layers3, Mail, Moon, Settings, Sun, X } from 'lucide-react'
import { projects, projectThreads } from '../data/projects'
import type { Theme } from '../App'

export type WorkspaceView = 'home' | 'experience' | 'stack' | 'contact' | `project-${number}` | `project-${number}-thread-${number}`

interface SidebarProps {
  activeView: WorkspaceView
  isOpen: boolean
  onClose: () => void
  onNavigate: (view: WorkspaceView, question?: string) => void
  theme: Theme
  onToggleTheme: () => void
}

const profileItems = [
  { label: 'Experience', view: 'experience' as const, icon: BriefcaseBusiness },
  { label: 'Core Stack', view: 'stack' as const, icon: Layers3 },
  { label: 'Contact', view: 'contact' as const, icon: Mail },
]

export function Sidebar({ activeView, isOpen, onClose, onNavigate, theme, onToggleTheme }: SidebarProps) {
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const [openProjects, setOpenProjects] = useState(() => new Set(projects.map((_, index) => index)))
  const accountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const closeAccountMenu = (event: PointerEvent) => {
      if (!accountRef.current?.contains(event.target as Node)) setIsAccountOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsAccountOpen(false)
    }
    document.addEventListener('pointerdown', closeAccountMenu)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeAccountMenu)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [])

  return (
    <>
      <button className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`} type="button" aria-label="메뉴 닫기" onClick={onClose} />
      <aside className={`workspace-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Portfolio workspace">
        <div className="sidebar-heading">
          <button className="identity" type="button" onClick={() => onNavigate('home')}>
            <span className="identity-brand">Portfolio</span>
            <span><strong>Workspace</strong><small>Software Engineer</small></span>
          </button>
          <button className="sidebar-close" type="button" aria-label="메뉴 닫기" onClick={onClose}><X /></button>
        </div>

        <nav className="sidebar-navigation" aria-label="Portfolio navigation">
          <button className={activeView === 'home' ? 'is-active' : ''} type="button" onClick={() => onNavigate('home')}>
            <Home aria-hidden="true" /><span>Overview</span>
          </button>
          <a href="https://github.com/study734" target="_blank" rel="noreferrer">
            <GitBranch aria-hidden="true" /><span>GitHub</span><ChevronRight className="nav-tail" aria-hidden="true" />
          </a>
        </nav>

        <div className="sidebar-group">
          <p>PROJECTS</p>
          <div className="project-tree">
            {projects.map((project, index) => {
              const isExpanded = openProjects.has(index)
              return (
                <div className="project-folder" key={project.name}>
                  <button className={`project-folder-trigger ${isExpanded ? 'is-open' : ''}`} type="button" aria-expanded={isExpanded} onClick={() => setOpenProjects((current) => {
                    const next = new Set(current)
                    if (next.has(index)) next.delete(index)
                    else next.add(index)
                    return next
                  })}>
                    <Folder aria-hidden="true" />
                    <span>{project.name}</span>
                  </button>
                  {isExpanded && <div className="project-threads" aria-label={`${project.name} 대화 기록`}>
                    {projectThreads[index].map((thread, threadIndex) => (
                      <button className={activeView === `project-${index}-thread-${threadIndex}` ? 'is-active' : ''} type="button" key={thread.title} onClick={() => onNavigate(`project-${index}-thread-${threadIndex}` as WorkspaceView, thread.title)}>
                        <FileText aria-hidden="true" />
                        <span>{thread.title}</span>
                      </button>
                    ))}
                  </div>}
                </div>
              )
            })}
          </div>
        </div>

        <div className="sidebar-group profile-group">
          <p>PROFILE</p>
          {profileItems.map(({ label, view, icon: Icon }) => (
            <button className={activeView === view ? 'is-active' : ''} type="button" key={view} onClick={() => onNavigate(view)}>
              <Icon aria-hidden="true" /><span>{label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-account" ref={accountRef}>
          {isAccountOpen && (
            <div className="account-menu" role="menu">
              <div className="account-menu-profile">
                <span className="account-avatar">임</span>
                <span><strong>임태욱</strong><small>Software Engineer</small></span>
              </div>
              <a role="menuitem" href="https://github.com/study734" target="_blank" rel="noreferrer"><GitBranch /><span>GitHub 프로필</span><ChevronRight /></a>
              <button role="menuitem" type="button" onClick={() => { onNavigate('home'); setIsAccountOpen(false) }}><BookOpenText /><span>프로젝트 둘러보기</span></button>
              <a role="menuitem" href="mailto:study734@naver.com"><Mail /><span>연락하기</span></a>
              <div className="account-menu-separator" />
              <button role="menuitem" type="button" onClick={onToggleTheme}>
                {theme === 'dark' ? <Sun /> : <Moon />}
                <span>{theme === 'dark' ? '화이트 테마' : '다크 테마'}</span>
                <small>{theme === 'dark' ? 'Light' : 'Dark'}</small>
              </button>
              <button role="menuitem" type="button" onClick={() => { onNavigate('contact'); setIsAccountOpen(false) }}><Settings /><span>설정 및 연락처</span></button>
            </div>
          )}
          <button className="account-trigger" type="button" aria-expanded={isAccountOpen} aria-haspopup="menu" onClick={() => setIsAccountOpen((open) => !open)}>
            <span className="account-avatar">임</span>
            <span><strong>임태욱</strong><small>Available to build</small></span>
            <CircleHelp aria-hidden="true" />
          </button>
        </div>
      </aside>
    </>
  )
}
