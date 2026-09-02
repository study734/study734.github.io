import { ArrowLeft, ArrowRight, Bell, Menu, Search } from 'lucide-react'

export function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  return (
    <header className="workspace-topbar">
      <div className="topbar-leading">
        <button className="mobile-sidebar-trigger" type="button" aria-label="메뉴 열기" onClick={onOpenSidebar}><Menu /></button>
        <span className="app-wordmark">TW Portfolio</span>
        <span className="topbar-divider" />
        <button type="button" aria-label="뒤로" onClick={() => window.history.back()}><ArrowLeft /></button>
        <button type="button" aria-label="앞으로" onClick={() => window.history.forward()}><ArrowRight /></button>
      </div>
      <div className="topbar-actions">
        <a href="#portfolio-query" aria-label="포트폴리오 검색"><Search /></a>
        <a href="#contact" aria-label="연락처"><Bell /></a>
      </div>
    </header>
  )
}
