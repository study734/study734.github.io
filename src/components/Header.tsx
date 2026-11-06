import { ArrowLeft, ArrowRight, Mail, Moon, PanelLeft, PanelRight, Search, Sun } from 'lucide-react'
import type { Theme } from '../App'

interface HeaderProps {
  onToggleSidebar: () => void
  isSidebarCollapsed: boolean
  theme: Theme
  onToggleTheme: () => void
  isReviewOpen: boolean
  onToggleReview: () => void
  onOpenContact?: () => void
}

export function Header({ onToggleSidebar, isSidebarCollapsed, theme, onToggleTheme, isReviewOpen, onToggleReview, onOpenContact }: HeaderProps) {
  return (
    <header className="workspace-topbar">
      <div className="topbar-leading">
        <button className="sidebar-toggle" type="button" aria-label="왼쪽 패널 전환" title={isSidebarCollapsed ? '왼쪽 패널 열기' : '왼쪽 패널 닫기'} onClick={onToggleSidebar}><PanelLeft /></button>
        <span className="app-wordmark">임태욱 · Portfolio</span>
        <span className="topbar-divider" />
        <button type="button" aria-label="뒤로" onClick={() => window.history.back()}><ArrowLeft /></button>
        <button type="button" aria-label="앞으로" onClick={() => window.history.forward()}><ArrowRight /></button>
      </div>
      <div className="topbar-actions">
        <a href="#portfolio-query" aria-label="포트폴리오 검색" title="검색 ( / )" onClick={(event) => { event.preventDefault(); document.getElementById('portfolio-query')?.focus() }}><Search /></a>
        <button className={isReviewOpen ? 'is-active' : ''} type="button" aria-label={isReviewOpen ? '리뷰 패널 닫기' : '리뷰 패널 열기'} onClick={onToggleReview}><PanelRight /></button>
        <button type="button" aria-label={`${theme === 'dark' ? '화이트' : '다크'} 테마로 전환`} onClick={onToggleTheme}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
        <button type="button" aria-label="연락처" title="연락처" onClick={onOpenContact}><Mail /></button>
      </div>
    </header>
  )
}
