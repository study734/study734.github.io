import { useState } from 'react'
import { CheckCircle2, ExternalLink, FileDiff, GitBranch, Layers3, X } from 'lucide-react'
import type { Project } from '../data/projects'

type ReviewTab = 'evidence' | 'stack' | 'links'

interface ReviewPaneProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

export function ReviewPane({ project, isOpen, onClose }: ReviewPaneProps) {
  const [activeTab, setActiveTab] = useState<ReviewTab>('evidence')
  const title = project?.name ?? 'Portfolio'

  if (!isOpen) return null

  return (
    <aside className="review-pane is-open" aria-label="프로젝트 리뷰">
      <div className="review-header">
        <div><span>REVIEW</span><strong>{title}</strong></div>
        <button type="button" aria-label="리뷰 패널 닫기" onClick={onClose}><X /></button>
      </div>

      <div className="review-summary">
        <FileDiff aria-hidden="true" />
        <span><strong>{project ? 'Project evidence' : 'Portfolio evidence'}</strong><small>{project?.subtitle ?? '프로젝트를 선택하면 검토 가능한 근거가 표시됩니다.'}</small></span>
      </div>

      <div className="review-tabs" role="tablist" aria-label="리뷰 범위">
        {([
          ['evidence', 'Evidence'],
          ['stack', 'Stack'],
          ['links', 'Links'],
        ] as const).map(([tab, label]) => (
          <button type="button" role="tab" aria-selected={activeTab === tab} key={tab} onClick={() => setActiveTab(tab)}>{label}</button>
        ))}
      </div>

      <div className="review-content">
        {activeTab === 'evidence' && (
          <div className="review-list">
            {(project?.contributions ?? ['프로젝트 사이드바에서 검토할 프로젝트를 선택하세요.', '하단 composer에서 /review를 입력해 이 패널을 다시 열 수 있습니다.']).map((item) => (
              <div key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></div>
            ))}
          </div>
        )}

        {activeTab === 'stack' && (
          <div className="review-stack">
            <div className="review-section-label"><Layers3 aria-hidden="true" /><span>TECHNICAL DETAIL</span></div>
            <ul>{(project?.technologies ?? ['Java', 'Spring Boot', 'React', 'TypeScript']).map((technology) => <li key={technology}>{technology}</li>)}</ul>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="review-links">
            {project?.repositoryUrl ? <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><GitBranch /><span><strong>Repository</strong><small>소스와 변경 이력 확인</small></span><ExternalLink /></a> : <p>공개 저장소 링크가 없는 프로젝트입니다.</p>}
            {project?.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer"><ExternalLink /><span><strong>Live demo</strong><small>배포 화면 열기</small></span><ExternalLink /></a>}
          </div>
        )}
      </div>

      <div className="review-footer"><span>{project ? `${project.contributions.length} evidence · ${project.technologies.length} technologies` : 'Select a project to inspect'}</span></div>
    </aside>
  )
}
