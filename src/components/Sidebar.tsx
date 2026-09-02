import { BookOpenText, BriefcaseBusiness, ChevronRight, Code2, GitBranch, Home, Layers3, Mail, X } from 'lucide-react'
import { projects } from '../data/projects'

export type WorkspaceView = 'home' | 'experience' | 'stack' | 'contact' | `project-${number}`

interface SidebarProps {
  activeView: WorkspaceView
  isOpen: boolean
  onClose: () => void
  onNavigate: (view: WorkspaceView) => void
}

const profileItems = [
  { label: 'Experience', view: 'experience' as const, icon: BriefcaseBusiness },
  { label: 'Core Stack', view: 'stack' as const, icon: Layers3 },
  { label: 'Contact', view: 'contact' as const, icon: Mail },
]

export function Sidebar({ activeView, isOpen, onClose, onNavigate }: SidebarProps) {
  return (
    <>
      <button className={`sidebar-scrim ${isOpen ? 'is-visible' : ''}`} type="button" aria-label="메뉴 닫기" onClick={onClose} />
      <aside className={`workspace-sidebar ${isOpen ? 'is-open' : ''}`} aria-label="Portfolio workspace">
        <div className="sidebar-heading">
          <button className="identity" type="button" onClick={() => onNavigate('home')}>
            <span className="identity-mark">TW</span>
            <span><strong>임태욱</strong><small>Software Engineer</small></span>
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
              const view = `project-${index}` as WorkspaceView
              return (
                <button className={activeView === view ? 'is-active' : ''} type="button" key={project.name} onClick={() => onNavigate(view)}>
                  <BookOpenText aria-hidden="true" />
                  <span><strong>{project.name}</strong><small>{project.role.slice(0, 2).join(' · ')}</small></span>
                </button>
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

        <div className="sidebar-status">
          <span className="status-dot" aria-hidden="true" />
          <span><strong>Available to build</strong><small>새로운 기술과 문제에 열려 있습니다</small></span>
          <Code2 aria-hidden="true" />
        </div>
      </aside>
    </>
  )
}
