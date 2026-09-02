import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronRight, Code2, ExternalLink, FileText, GitBranch, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import type { Project, ProjectThread } from '../data/projects'
import { TechList } from './TechList'

interface ProjectShowcaseProps {
  project: Project
  index: number
  question?: string
  thread?: ProjectThread | null
  onOpenReview?: () => void
}

export function ProjectShowcase({ project, index, question, thread, onOpenReview }: ProjectShowcaseProps) {
  const number = String(index + 1).padStart(2, '0')
  const [isWorkOpen, setIsWorkOpen] = useState(true)
  const defaultQuestion = `${project.name}에서 어떤 문제를 해결했고, 무엇을 구현했나요?`
  const visibleQuestion = thread?.title || question || defaultQuestion
  const visibleContributions = thread?.contributions ?? project.contributions

  return (
    <article className="project-thread">
      <div className="thread-question"><p>{visibleQuestion}</p></div>

      <div className="thread-progress" aria-label="프로젝트 응답 정보">
        <button type="button" onClick={() => setIsWorkOpen((open) => !open)} aria-expanded={isWorkOpen}>
          <span>프로젝트 {number} · 핵심 작업 {visibleContributions.length}개</span>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>

      <div className="thread-answer">
        <p className="thread-lead"><strong>{project.name}</strong> {thread?.answer ?? '프로젝트의 역할과 구현 근거를 정리했습니다.'}</p>
        {!thread && <p>{project.subtitle}</p>}

        <section className="thread-section">
          <h2>맡은 역할</h2>
          <div className="thread-role-list" aria-label="프로젝트 역할">
            {project.role.map((role, roleIndex) => {
              const Icon = roleIndex === 0 ? UsersRound : roleIndex === 1 ? ShieldCheck : Sparkles
              return <span key={role}><Icon aria-hidden="true" />{role}</span>
            })}
          </div>
        </section>

        <section className="thread-section">
          <h2>{thread ? '이 대화의 답변 근거' : '핵심 기여'}</h2>
          <ul className="thread-bullets">{visibleContributions.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="thread-section">
          <h2>기술 구성</h2>
          <TechList technologies={project.technologies} />
        </section>

        <section className="thread-section thread-verification">
          <h2>확인할 수 있는 근거</h2>
          <ul>
            <li><CheckCircle2 aria-hidden="true" />기여 내용과 사용 기술을 프로젝트 단위로 정리</li>
            <li><CheckCircle2 aria-hidden="true" />Review 패널에서 Evidence · Stack · Links를 교차 확인</li>
            {project.repositoryUrl && <li><CheckCircle2 aria-hidden="true" />공개 저장소에서 구현 이력 확인 가능</li>}
          </ul>
        </section>
      </div>

      <section className="work-summary-card" aria-label="핵심 작업 요약">
        <header>
          <FileText aria-hidden="true" />
          <span><strong>핵심 작업 {visibleContributions.length}개를 정리했습니다</strong><small>기여 {visibleContributions.length} · 기술 {project.technologies.length}</small></span>
          <button type="button" onClick={() => setIsWorkOpen((open) => !open)} aria-label={isWorkOpen ? '핵심 작업 접기' : '핵심 작업 펼치기'}><ChevronDown className={isWorkOpen ? '' : 'is-collapsed'} aria-hidden="true" /></button>
        </header>
        {isWorkOpen && <div className="work-summary-list">{visibleContributions.map((item, itemIndex) => <div key={item}><span><Code2 aria-hidden="true" />work/{number}/{String(itemIndex + 1).padStart(2, '0')}</span><strong>{item}</strong><small>완료</small></div>)}</div>}
        <footer>
          {project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><GitBranch aria-hidden="true" />저장소 보기<ExternalLink aria-hidden="true" /></a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">데모 보기<ExternalLink aria-hidden="true" /></a>}
          {onOpenReview && <button type="button" onClick={onOpenReview}>Review 열기</button>}
        </footer>
      </section>
    </article>
  )
}
